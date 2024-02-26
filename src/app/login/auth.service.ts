import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
  ) {}

  getUserData() {
    const local: any = localStorage.getItem('userData');
    const data: any = JSON.parse(local);
    return data;
  }

  login(username: any) {
    localStorage.setItem(
      'userData',
      JSON.stringify({ username, isLoggedIn: true })
    );
    this.router.navigate(['/']);
  }
  logout() {
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }
}
