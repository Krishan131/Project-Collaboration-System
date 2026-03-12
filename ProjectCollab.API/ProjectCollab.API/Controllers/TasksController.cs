using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ProjectCollab.API.Hubs;
using ProjectCollab.API.Models;

namespace ProjectCollab.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ProjectCollabContext _context;
        private readonly IHubContext<ProjectHub> _hubContext;

        public TasksController(ProjectCollabContext context, IHubContext<ProjectHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // Create Task
        [HttpPost]
        public IActionResult CreateTask(Task1 task)
        {
            _context.Tasks.Add(task);
            _context.SaveChanges();

            var notification = new Notification
            {
                UserId = task.AssignedTo ?? 0,
                Content = "You have been assigned a new task: " + task.Title,
                IsRead = false,
                CreatedAt = DateTime.Now
            };

            _context.Notifications.Add(notification);
            _context.SaveChanges();

            return Ok(task);
        }
        // Get Tasks for a Project
        [HttpGet("project/{projectId}")]
        public IActionResult GetTasksByProject(int projectId)
        {
            var tasks = _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .ToList();

            return Ok(tasks);
        }

        // Update Task Status
        public class UpdateTaskStatusRequest
        {
            public string Status { get; set; }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] UpdateTaskStatusRequest request)
        {
            if (request == null)
                return BadRequest();

            var task = _context.Tasks.Find(id);
            if (task == null)
                return NotFound();

            // Update only the Status field
            task.Status = request.Status;

            _context.SaveChanges();

            // Broadcast updated task to the SignalR group for the project
            var projectId = task.ProjectId;
            if (projectId != null)
            {
                await _hubContext.Clients.Group(projectId.ToString()).SendAsync("TaskUpdated", task);
            }

            return Ok(task);
        }
    }
}
