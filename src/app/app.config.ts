import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { TokenInterceptor } from './auth/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
};
