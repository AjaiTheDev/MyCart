using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
    public class OrderServices
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userDb;

        public OrderServices(ApplicationDbContext db, UserManager<ApplicationUser> userDb)
        {
            _db = db;
            _userDb = userDb;
        }

        public async Task<ServiceResponse<OrderViewDto[]>?> GetAllAsync()
        {
            var result = new ServiceResponse<OrderViewDto[]?>();
            var orderedProducts = await _db.Orderproducts
                .Include(m => m.Product)
                .Include(m => m.Order)
                .Where(m => m.OrderId == m.Order.Id)
                .Select(m => new OrderViewDto
                {
                    orderId = m.OrderId,
                    OrderTime = m.Order.OrderTime,
                    DeliveryAddress = m.Order.DeliveryAddress,
                    Product = new()
                    {
                        Id = m.Product.Id,
                        Name = m.Product.Name,
                        Brand = m.Product.Brand,
                    },
                    OfferPrice = m.OfferPrice,
                    RetailPrice = m.Price,

                }).ToArrayAsync();


            return new()
            {
                Result = orderedProducts
            };
        }

        public async Task<ServiceResponse<OrderViewDto[]>?> GetAllForCustomerAsync(string userId)
        {
            var result = new ServiceResponse<OrderViewDto[]?>();
            var orderedProducts = await _db.Orderproducts
                .Include(m => m.Product)
                .Include(m => m.Order)
                .Where(m => m.OrderId == m.Order.Id && m.Order.ApplicationUserId == userId)
                .Select(m => new OrderViewDto
                {
                    orderId = m.OrderId,
                    OrderTime = m.Order.OrderTime,
                    DeliveryAddress = m.Order.DeliveryAddress,
                    Product = new()
                    {
                        Id = m.Product.Id,
                        Name = m.Product.Name,
                        Brand = m.Product.Brand,
                    },
                    OfferPrice = m.OfferPrice,
                    RetailPrice = m.Price,

                }).ToArrayAsync();
            return new ()
            {
                Result = orderedProducts
            };
        }
        public async Task<ServiceResponse<OrderViewDto>?> CreateAsync(OrderCreateDto dto, string userId)
        {

            var result = new ServiceResponse<OrderViewDto?>();
            var cartProducts = await _db.Carts.Include(m=>m.Product)
                            .Where(m=>m.ApplicationUserId == userId).ToArrayAsync();
            if(!cartProducts.Any())
            {
                return null;
            }

            if (!result.IsValid)
            {
                return result;
            }
            var orders = new Order
            {
                ApplicationUserId = userId,
                DeliveryAddress = dto.DeliveryAddress,
                PaymentStatus = PaymentStatus.Paid,
                OrderTime = DateTime.UtcNow,
                TotalPrice = dto.TotalPrice,
            };

            _db.Orders.Add(orders);
            await _db.SaveChangesAsync();

            var ordersByUser = await _db.Orders.FindAsync(orders.Id);
            if(ordersByUser != null)
            {
                foreach (var item in cartProducts)
                {
                    var price = await _db.Prices.FirstOrDefaultAsync(m=>m.ProductId == item.ProductId);
                    var orderProduct = new OrderProduct()
                    {
                        ProductId = item.ProductId,
                        OfferPrice = price.OfferPrice,
                        OrderId = orders.Id,
                        Price = price.RetailPrice
                    };

                    _db.Orderproducts.Add(orderProduct);
                    await _db.SaveChangesAsync();
                }
            }
            return result;

        }
    }
}
