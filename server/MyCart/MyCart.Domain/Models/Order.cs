using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MyCart.Domain.Types;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyCart.Domain.Models
{
    public class Order
    {

        public int Id { get; set; }

        public ApplicationUser ApplicationUser { get; set; }
        public string ApplicationUserId { get; set; }

        [StringLength(500)]
        public string DeliveryAddress { get; set; }

        public PaymentStatus PaymentStatus { get; set; }

        public DateTime OrderTime { get; set; }

        [Column(TypeName = "decimal(10, 3)")]
        public decimal TotalPrice { get; set; }
    }
}
