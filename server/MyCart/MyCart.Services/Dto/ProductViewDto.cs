using MyCart.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyCart.Services.Dto
{
    public class ProductViewDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Brand { get; set; }

        public string Description { get; set; }

        public int CategoryId { get; set; }

        public int Stock { get; set; }

        public PriceViewDto Price { get; set; }

        public CategoryViewDto Category { get; set; }

        public DateTime CreatedOn { get; set; }

        public string? Image { get; set; }
    }
}
