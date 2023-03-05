using Microsoft.AspNetCore.Http;
using MyCart.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyCart.Services.Dto
{
    public class ProductCreateDto
    {
        public string Name { get; set; }

        public string Brand { get; set; }

        public string Description { get; set; }

        public int CategoryId { get; set; }

        public int Stock { get; set; }  

        public decimal  RetailPrice { get; set; }

        public decimal OfferPrice { get; set; }

        public IFormFile? Image { get; set; }
    }
}
