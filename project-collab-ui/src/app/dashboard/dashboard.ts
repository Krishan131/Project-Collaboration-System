import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  projects: any[] = [];
  projectName = '';
  projectDescription = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.api.getProjects().subscribe({
      next: (res: any) => {
        console.log('GET /projects response:', res);
        this.projects = Array.isArray(res)
          ? res
          : (res.data ?? res.projects ?? (res && typeof res === 'object' ? Object.values(res) : []));
        this.cdr.markForCheck();  // ← tells Angular to re-render
      },
      error: () => {
        alert('Failed to load projects');
      }
    });
  }

  createProject() {
    const userId = localStorage.getItem('userId');
    const project = {
      name: this.projectName,
      description: this.projectDescription,
      createdBy: Number(userId)
    };
    this.api.createProject(project).subscribe({
      next: () => {
        this.projectName = '';
        this.projectDescription = '';
        this.loadProjects();
      },
      error: () => {
        alert('Failed to create project');
      }
    });
  }

  openProject(projectId: number) {
  this.router.navigate(['/project', projectId]);
}
}
