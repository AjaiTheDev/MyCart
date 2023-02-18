﻿using MyCart.Domain.Models;
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
    public class FeedbackServices
    {
        private readonly ApplicationDbContext _db;

        public FeedbackServices(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResponse<FeedbackViewDto[]>> GetAllAsync()
        {
            var feedback = await _db.Feedbacks
                .Include(m => m.ApplicationUser)
                .Where(m =>m.ApplicationUser.Id == m.ApplicationUserId)
                .Select(f => new FeedbackViewDto
                {
                    Id = f.Id,
                    Name = f.ApplicationUser.FullName,
                    ApplicationUserId = f.ApplicationUser.Id,
                    Message = f.Message,
                    CreatedOn = f.CreatedOn
                }).ToArrayAsync();

            return new()
            {
                Result = feedback
            };
        }

        public async Task<FeedbackViewDto> CreateAsync(FeedbackCreateDto dto)
        {
            var user = await _db.Customers.FirstOrDefaultAsync(m => m.ApplicationUserId == dto.ApplicationUserId);

            if (user == null)
                return null;

            Feedback feedback = new()
            {
                Message = dto.Message,
                ApplicationUserId = user.ApplicationUserId,
                CreatedOn = DateTime.Now
            };

            _db.Feedbacks.Add(feedback);
            await _db.SaveChangesAsync();

            return new()
            {
                Id = feedback.Id,
                Message = feedback.Message,
                CreatedOn = feedback.CreatedOn
            };
        }

    }
}
