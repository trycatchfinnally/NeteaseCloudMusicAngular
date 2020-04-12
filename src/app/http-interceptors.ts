import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {LoggingInterceptor} from 'src/app/Interceptor/LoggingInterceptor'
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
  ];