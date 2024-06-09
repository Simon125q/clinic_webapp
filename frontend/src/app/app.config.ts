import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideClientHydration} from "@angular/platform-browser";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {AuthInterceptor} from "./auth/auth-interceptor";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient(),
  provideHttpClient(withInterceptorsFromDi(),),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}]
};
