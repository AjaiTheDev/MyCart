﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyCart.Domain.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class Product
    {
        public int Id { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(25)]
        public string Brand { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        public int CategoryId { get; set; }

        public Category Category { get; set; }

    }
}
