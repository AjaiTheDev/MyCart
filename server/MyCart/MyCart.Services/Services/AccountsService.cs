using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MyCart.Domain.Models;
using MyCart.Domain.Types;
using MyCart.Services.Data;
using MyCart.Services.Dto;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MyCart.Services.Services
{
    public class AccountsService
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signinManager;
        private readonly IConfiguration _configuration;

        public AccountsService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signinManager,
            ApplicationDbContext db,
            IConfiguration configuration)
        {
            _db = db;
            _userManager = userManager;
            _roleManager = roleManager;
            _signinManager = signinManager;
            _configuration = configuration;
        }

        public async Task<ServiceResponse<bool>> CreateCustomerAsync(CustomerCreateDto dto)
        {
            var response = new ServiceResponse<bool>(); 

            var user = new ApplicationUser
            {
                FullName = dto.Name,
                Email = dto.Email,
                UserName = Guid.NewGuid().ToString()
            };

            var userStatus = await _userManager.CreateAsync(user, dto.Password);

            if (!userStatus.Succeeded)
            {
                response.AddError("", "Failed to create user");
                return response;
            }

            await _userManager.AddToRoleAsync(user, "Customer");

            if (user.Id == null)
            {
                response.AddError("", "Userid is null in this context");
                return response;
            }
            var customer = new Customer
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.phone,
                DateOfBirth = dto.DateOfBirth,
                ApplicationUserId = user.Id
            };

            _db.Customers.Add(customer);
            await _db.SaveChangesAsync();

            response.Result = true;
            return response;
        }

        public async Task<ServiceResponse<string>> LoginAsync(LoginDto dto)
        {
            var response = new ServiceResponse<string>();
            var user = await _userManager.FindByEmailAsync(dto.Email);

            if (user == null)
            {
                response.AddError(nameof(dto.Email), "An account with this email does not exist.");
                return response;
            }

            var signin = await _signinManager.CheckPasswordSignInAsync(user, dto.Password, true);

            if (signin.Succeeded)
            {
                response.Result = GenerateToken(user);
                return response;
            }

            if (signin.IsLockedOut)
                response.AddError("", "Account locked.");
            else if (signin.IsNotAllowed)
                response.AddError("", "You are not allowed to signin.");
            else
                response.AddError("", "Invalid email/password.");

            return response;
        }

        public async Task<ServiceResponse<CustomerViewDto>> GetProfileAsync(string id)
        {
            var response = new ServiceResponse<CustomerViewDto>();
            var customer = await _db.Customers.FirstOrDefaultAsync(m => m.ApplicationUserId == id);

            if (customer == null)
            {
                return response;
            }

            var user = new CustomerViewDto()
            {
                Id = customer.Id,
                Name = customer.Name,
                Email = customer.Email,
                Phone = customer.Phone,
                DateOfBirth = customer.DateOfBirth
            };
            response.Result = user;
            return response;
        }

        private string GenerateToken(ApplicationUser user)
        {

            var role = _userManager.GetRolesAsync(user)
                        .GetAwaiter()
                        .GetResult()
                        .First();

            var claims = new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, $"{user.FullName}"),
                new Claim(ClaimTypes.Role, role)
            };

            string issuer = _configuration["Jwt:Issuer"];
            string audience = _configuration["Jwt:Audience"];
            string key = _configuration["Jwt:Key"];

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(signingKey, "HS256");

            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

