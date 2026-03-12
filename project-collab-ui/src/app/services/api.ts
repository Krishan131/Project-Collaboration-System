import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://localhost:7266/api';

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  getProjects() {
    return this.http.get(`${this.baseUrl}/projects`);
  }

  createProject(data: any) {
    return this.http.post(`${this.baseUrl}/projects`, data);
  }

  getTasks(projectId: number) {
    return this.http.get(`${this.baseUrl}/tasks/project/${projectId}`);
  }

  createTask(data: any) {
    return this.http.post(`${this.baseUrl}/tasks`, data);
  }

  getMessages(projectId: number) {
    return this.http.get(`${this.baseUrl}/messages/project/${projectId}`);
  }

  sendMessage(data: any) {
    return this.http.post(`${this.baseUrl}/messages`, data);
  }

  getNotifications(userId: number) {
  return this.http.get(`${this.baseUrl}/notifications/${userId}`);
  }

  updateTaskStatus(id: number, status: string) {
    return this.http.put(`${this.baseUrl}/tasks/${id}`, { status });
  }
}