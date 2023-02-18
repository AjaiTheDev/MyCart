﻿using MyCart.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyCart.Services.Dto
{
    public class CartViewDto
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public ProductViewDto Product { get; set; }
    }
}
