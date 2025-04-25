import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  showError: string = "";

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {
        this.authService.loginWithOAuthCode(code).subscribe({
          next: (res) => {
            this.authService.saveToken(res.token);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.warn('Final error after 3 tries:', err);
            this.showError = err.error.error;
          },
        });
      }
    });
  }

  onLoginWithGoogle() {
    const isDev = !environment.production;
    if (isDev) {
      this.router.navigate(['/login'], {
        queryParams: { code: 'mock-code-123' },
      });
    } else {
      window.location.href =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=YOUR_CLIENT_ID&` +
        `redirect_uri=http://localhost:4200/login&` +
        `response_type=code&` +
        `scope=email profile`;
    }
  }
}
