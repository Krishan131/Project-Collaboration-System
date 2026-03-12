using Microsoft.AspNetCore.Mvc;
using ProjectCollab.API.Models;

namespace ProjectCollab.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ProjectCollabContext _context;

        public ProjectsController(ProjectCollabContext context)
        {
            _context = context;
        }

        // Create Project
        [HttpPost]
        public IActionResult CreateProject(Project project)
        {
            project.CreatedAt = DateTime.Now;

            _context.Projects.Add(project);
            _context.SaveChanges();

            return Ok(project);
        }

        // Get All Projects
        [HttpGet]
        public IActionResult GetProjects()
        {
            var projects = _context.Projects.ToList();

            return Ok(projects);
        }
    }
}