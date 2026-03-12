import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email = '';
  password = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {

    const data = {
      email: this.email,
      passwordHash: this.password
    };

    this.api.login(data).subscribe({
      next: (res: any) => {

        localStorage.setItem('userId', res.id);

        this.router.navigate(['/dashboard']);

      },
      error: () => {
        alert('Invalid email or password');
      }
    });

  }

}