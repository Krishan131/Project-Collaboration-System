using Microsoft.AspNetCore.Mvc;
using ProjectCollab.API.Models;

namespace ProjectCollab.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly ProjectCollabContext _context;

        public NotificationsController(ProjectCollabContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public IActionResult GetNotifications(int userId)
        {
            var notifications = _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToList();

            return Ok(notifications);
        }
    }
}