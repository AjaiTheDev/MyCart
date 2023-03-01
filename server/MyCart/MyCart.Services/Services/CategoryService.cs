using MyCart.Domain.Models;
using MyCart.Domain.Types;
using MyCart.Services.Data;
using MyCart.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyCart.Services.Services
{
    public class CategoryService
    {
        private readonly ApplicationDbContext _db;

        public CategoryService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResponse<CategoryViewDto[]>> GetAllAsync()
        {
            var categories = await _db.Categories.Select(m => new CategoryViewDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
            }).ToArrayAsync();

            return new()
            {
                Result = categories
            };
        }

        public async Task<ServiceResponse<CategoryViewDto>> CreateAsync(CategoryCreateDto dto)
        {

            var result = new ServiceResponse<CategoryViewDto>();

            Category category = new()
            {
                Name = dto.Name,
                Description = dto.Description,
            };

            _db.Categories.Add(category);
            await _db.SaveChangesAsync();

            result.Result = new()
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
            };

            return result;
        }

        public async Task<ServiceResponse<CategoryViewDto>?> UpdateAsync(int id, CategoryCreateDto dto)
        {
            var response = new ServiceResponse<CategoryViewDto>();

            var category = await _db.Categories.FindAsync(id);
            if (category == null)
                return null;

            // Check if any other category has the same name.
            if (await _db.Categories.AnyAsync(m => m.Name == dto.Name))
            {
                response.AddError("Name", "A category with the same name already exists.");
            }

            if (!response.IsValid)
                return response;

            category.Name = dto.Name;
            category.Description = dto.Description;
            await _db.SaveChangesAsync();

            response.Result = new CategoryViewDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };
            return response;
        }

        public async Task<ServiceResponse<bool>?> DeleteAsync(int id)
        {
            var category = await _db.Categories.FindAsync(id);
            if (category == null)
                return null;

            _db.Categories.Remove(category);
            await _db.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                Result = true
            };
        }
    }
}
