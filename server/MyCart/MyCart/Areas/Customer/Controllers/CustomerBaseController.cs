using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace MyCart.WebApp.Areas.Customer.Controllers
{

    [Area("Customer")]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class CustomerBaseController: ControllerBase
    {
    }
}
