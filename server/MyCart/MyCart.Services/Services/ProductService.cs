using Microsoft.AspNetCore.Hosting;
using MyCart.Domain.Models;
using MyCart.Domain.Types;
using MyCart.Services.Data;
using MyCart.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace MyCart.Services.Services
{
    public class ProductService
    {
        private readonly ApplicationDbContext _db;
        private readonly IHostingEnvironment _webHost;

        public ProductService(ApplicationDbContext db,
            IHostingEnvironment webHost)
        {
            _db = db;
            _webHost = webHost;
        }

        public async Task<ServiceResponse<List<ProductViewDto>>> GetAllAsync()
        {

            var products = await _db.Products
                .Include(m => m.Category)
                .Include(m => m.Price).Where(m => m.Price.ProductId == m.Id)
                .Select(m => new ProductViewDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Brand = m.Brand,
                    Description = m.Description,
                    CategoryId = m.CategoryId,
                    Stock = m.Stock,
                    Image = m.Image,
                    Price = new()
                    {
                        Id = m.Price.Id,
                        OfferPrice = m.Price.OfferPrice,
                        RetailPrice = m.Price.RetailPrice,
                    },
                    Category = new()
                    {
                        Id = m.Category.Id,
                        Name = m.Category.Name,
                        Description = m.Category.Description
                    },
                    CreatedOn = m.CreatedOn
                }).ToListAsync();

            return new()
            {
                Result = products
            };
        }

        public async Task<ServiceResponse<ProductViewDto?>> GetByIdAsync(int id)
        {
            var result = new ServiceResponse<ProductViewDto?>();

            var product = await _db.Products
                .Include(m => m.Category)
                .Include(m => m.Price).Where(m => m.Price.ProductId == id)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (product == null)
                return null;

            result = new()
            {
                Result = new()
                {
                    Id = product.Id,
                    Name = product.Name,
                    Brand = product.Brand,
                    Description = product.Description,
                    Stock = product.Stock,
                    Image = product.Image,
                    Price = new()
                    {
                        Id = product.Price.Id,
                        OfferPrice = product.Price.OfferPrice,
                        RetailPrice = product.Price.RetailPrice,

                    },
                    Category = new()
                    {
                        Id = product.Category.Id,
                        Name = product.Category.Name,
                        Description = product.Category.Description
                    }

                }
            };

            return result;
        }

        public async Task<ServiceResponse<ProductViewDto>> CreateAysnc(ProductCreateDto dto)
        {
            var result = new ServiceResponse<ProductViewDto>();
            var category = await _db.Categories.FindAsync(dto.CategoryId);

            if (category == null)
                result.AddError(nameof(dto.CategoryId), "Invalid category");

            if (dto.Image is null)
                result.AddError(nameof(dto.Image), "Please provide a product image.");

            if (!result.IsValid)
                return result;

            string fileNameByUser = dto.Image.FileName;
            string fileExtension = Path.GetExtension(fileNameByUser).ToLower();
            var allowedFileExtensions = new[] { ".jpg", ".jpeg", ".png" };

            if (!allowedFileExtensions.Contains(fileExtension))
            {
                result.AddError(nameof(dto.Image), "Invalid file type.");
                return result;
            }

            string staticFileDirs = _webHost.WebRootPath;
            string uniqueFileName = Guid.NewGuid().ToString() + fileExtension;
            string uploadsDir = Path.Join(staticFileDirs, "uploads", uniqueFileName);

            using (var fileStream = new FileStream(uploadsDir, FileMode.Create))
            {
                await dto.Image.CopyToAsync(fileStream);
            }

            Product product = new()
            {
                Name = dto.Name,
                Brand = dto.Brand,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                Stock = dto.Stock,
                Image = Path.Combine(uniqueFileName)
            };

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            Price price = new()
            {
                RetailPrice = dto.RetailPrice,
                OfferPrice = dto.OfferPrice,
                ProductId = product.Id,
            };

             _db.Prices.Add(price);
            await _db.SaveChangesAsync();

            var productPrice = await _db.Prices.FirstOrDefaultAsync(m=>m.ProductId == product.Id);
            if (productPrice == null)
            {
                result.AddError("", "product id is null");
                return result;
            }

            result.Result = new ProductViewDto()
            {
                Id = product.Id,
                Name = product.Name,
                Brand = product.Brand,
                Description = product.Description,
                CategoryId = product.CategoryId,
                Stock = product.Stock,
                Price = new()
                {
                    Id = productPrice.Id,
                    OfferPrice = productPrice.OfferPrice,
                    RetailPrice = productPrice.RetailPrice,
                },
                Category = new CategoryViewDto()
                {
                    Id = product.CategoryId,
                    Name = category.Name,
                    Description = category.Description,
                },

            };

            return result;
        }

        public async Task<ServiceResponse<ProductViewDto>?> UpdateAsync(int id, ProductCreateDto dto)
        {
            var result = new ServiceResponse<ProductViewDto>();


            var product = await _db.Products
                .Include(m => m.Category).Where(m => m.Category.Id == m.CategoryId)
                .Include(m => m.Price).Where(m => m.Price.ProductId == id)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (product == null)
                return null;

            if (!await _db.Categories.AnyAsync(m => m.Id == dto.CategoryId))
                result.AddError(nameof(dto.CategoryId), "Invalid category");

            if (await _db.Products.AnyAsync(m => m.Name == dto.Name && m.Id != id))
                result.AddError(nameof(dto.Name), "A similar product already exists.");

            if (!result.IsValid)
                return result;

            product.Name = dto.Name;
            product.Brand = dto.Brand;
            product.Description = dto.Description;
            product.CategoryId = dto.CategoryId;
            product.Stock = dto.Stock;
            product.Price = new()
            {
                OfferPrice = dto.OfferPrice,
                RetailPrice = dto.RetailPrice,
            };


            await _db.SaveChangesAsync();

            result.Result = new ProductViewDto()
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Brand = dto.Brand,
                CategoryId = dto.CategoryId,
                Stock = dto.Stock,
                Category = new()
                {
                    Id = product.Category.Id,
                    Name = product.Category.Name,
                    Description = product.Category.Description
                },
                Price = new()
                {
                    Id = product.Price.Id,
                    OfferPrice = product.Price.OfferPrice,
                    RetailPrice = product.Price.RetailPrice,
                }
            };
            return result;
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var result = new ServiceResponse<bool>();
            var product = await _db.Products.FindAsync(id);
            var productPrice = await _db.Prices.FirstOrDefaultAsync(m => m.ProductId == product.Id);

            if (product == null || productPrice == null)
                return null;

            _db.Prices.Remove(productPrice);
            await _db.SaveChangesAsync();
            _db.Products.Remove(product);
            await _db.SaveChangesAsync();

            return new()
            {
                Result = true
            };

        }

    }
}
