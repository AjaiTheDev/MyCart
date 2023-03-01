using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyCart.Domain.Models
{
    public class Feedback
    {
        public int Id { get; set; }

        [StringLength(1000)]
        public string Message { get; set; }

        public string UserEmail { get; set; }

        public string? ApplicationUserId { get; set; }

        public ApplicationUser ApplicationUser { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}
