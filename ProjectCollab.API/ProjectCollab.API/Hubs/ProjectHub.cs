using Microsoft.AspNetCore.SignalR;

namespace ProjectCollab.API.Hubs
{
    public class ProjectHub : Hub
    {
        public async Task SendMessageToProject(int projectId, object message)
        {
            await Clients.Group(projectId.ToString())
                .SendAsync("ReceiveMessage", message);
        }

        public async Task JoinProject(int projectId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, projectId.ToString());
        }
    }
}