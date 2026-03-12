import { Component,ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ApiService } from './services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html'
})
export class App {

  notifications: any[] = [];
  showNotifications = false;

  constructor(private router: Router, private api: ApiService,private cdr: ChangeDetectorRef) {}

  loadNotifications() {

    const userId = Number(localStorage.getItem('userId'));

    this.api.getNotifications(userId).subscribe({
      next: (res: any) => {
        this.notifications = res;
        this.showNotifications = !this.showNotifications;
         this.cdr.markForCheck();
      }
    });

  }

  get notificationCount() {
    return this.notifications ? this.notifications.length : 0;
  }

  logout() {
    localStorage.removeItem('userId');
    this.router.navigate(['/']);
  }

}