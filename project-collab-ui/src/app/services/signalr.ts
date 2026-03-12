import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class Signalr {

  private hubConnection!: signalR.HubConnection;

  startConnection(): Promise<void> {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7266/projectHub')
      .withAutomaticReconnect()
      .build();

    return this.hubConnection.start()
      .catch(err => console.error(err));

  }

  joinProject(projectId: number) {
    this.hubConnection.invoke('JoinProject', projectId);
  }

  onMessageReceived(callback: any) {
    this.hubConnection.on('ReceiveMessage', callback);
  }

  onTaskUpdated(callback: any) {
    this.hubConnection.on('TaskUpdated', callback);
  }

  sendMessage(projectId: number, message: any) {
    this.hubConnection.invoke('SendMessageToProject', projectId, message);
  }

}