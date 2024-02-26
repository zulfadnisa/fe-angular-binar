import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
  ) {}

  isLoggedIn() {
    const local: any = localStorage.getItem('loggedIn');
    const data: any = JSON.parse(local);
    return data?.status ? data?.status : false;
  }

  login(username: any) {
    localStorage.setItem(
      'loggedIn',
      JSON.stringify({ username, status: true })
    );
    this.router.navigate(['/']);
  }
  logout() {
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }
}
