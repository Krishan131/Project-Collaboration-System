import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Signalr } from '../../services/signalr';
@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css'
})
export class ProjectDetails implements OnInit {

  projectId!: number;
  tasks: any[] = [];
  projectName = '';
  taskTitle = '';
  taskStatus = 'Todo';
  messages: any[] = [];
  messageText = '';

  constructor(private route: ActivatedRoute, private api: ApiService,private cdr: ChangeDetectorRef,private signalr: Signalr) {}

  ngOnInit(): void {

    this.projectId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadTasks();
    this.loadProjectName();
    this.loadMessages();
    this.signalr.startConnection().then(() => {
      this.signalr.joinProject(this.projectId);
      this.signalr.onMessageReceived((message: any) => {
        this.messages.push(message);
        this.cdr.markForCheck();
      });
      this.signalr.onTaskUpdated((updatedTask: any) => {
        const idx = this.tasks.findIndex(t => t.id === updatedTask?.id);
        if (idx > -1) {
          this.tasks[idx] = { ...this.tasks[idx], ...updatedTask };
          this.cdr.markForCheck();
        }
      });
    });
  
  }

  loadProjectName() {

    this.api.getProjects().subscribe({
      next: (res: any) => {
        const proj = (res || []).find((p: any) => Number(p.id) === Number(this.projectId));
        this.projectName = proj ? proj.name : '';
        this.cdr.markForCheck();
      },
      error: () => {
        console.error('Failed to load projects');
      }
    });

  }

  loadTasks() {

    this.api.getTasks(this.projectId).subscribe({
      next: (res: any) => {
        this.tasks = res;
         this.cdr.markForCheck();
      },
      error: () => {
        alert('Failed to load tasks');
      }
    });

  }
  createTask() {

  const task = {
    title: this.taskTitle,
    status: this.taskStatus,
    projectId: this.projectId,
    assignedTo: Number(localStorage.getItem('userId'))
  };

  this.api.createTask(task).subscribe({
    next: () => {

      this.taskTitle = '';
      this.taskStatus = 'Todo';

      this.loadTasks();

    },
    error: () => {
      alert('Failed to create task');
    }
  });

}

  updateTaskStatus(id: number, status: string) {

    this.api.updateTaskStatus(id, status).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err: any) => {
        console.error('Failed to update task status', err);
        const statusCode = err?.status ?? 'unknown';
        const url = err?.url ?? 'unknown URL';
        alert(`Failed to update task status (HTTP ${statusCode})`);
      }
    });

  }
loadMessages() {

  this.api.getMessages(this.projectId).subscribe({
    next: (res: any) => {
      this.messages = res;
    },
    error: () => {
      alert('Failed to load messages');
    }
  });

}
sendMessage() {

  const message = {
    content: this.messageText,
    projectId: this.projectId,
    senderId: Number(localStorage.getItem('userId'))
  };

  this.api.sendMessage(message).subscribe({
    next: () => {

      this.signalr.sendMessage(this.projectId, message);
      //this.messages.push(message);

      this.messageText = '';

    },
    error: () => {
      alert('Failed to send message');
    }
  });

}

}