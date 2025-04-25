import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retry, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';
  private tokenKey = 'access_token';

  constructor(private http: HttpClient, private router: Router) {}

  loginWithOAuthCode(code: string) {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/auth/oauth-login`, { code })
      .pipe(
        retry(3), // Retry up to 3 times
        catchError((err) => {
          console.error('API failed after 3 attempts', err);
          return throwError(() => err);
        })
      );
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
}
