using Microsoft.AspNetCore.Mvc;
using ProjectCollab.API.Models;

namespace ProjectCollab.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ProjectCollabContext _context;

        public MessagesController(ProjectCollabContext context)
        {
            _context = context;
        }

        // Send message
        [HttpPost]
        public IActionResult SendMessage(Message message)
        {
            message.SentAt = DateTime.Now;

            _context.Messages.Add(message);
            _context.SaveChanges();

            return Ok(message);
        }

        // Get messages for a project
        [HttpGet("project/{projectId}")]
        public IActionResult GetMessages(int projectId)
        {
            var messages = _context.Messages
                .Where(m => m.ProjectId == projectId)
                .OrderBy(m => m.SentAt)
                .ToList();

            return Ok(messages);
        }
    }
}