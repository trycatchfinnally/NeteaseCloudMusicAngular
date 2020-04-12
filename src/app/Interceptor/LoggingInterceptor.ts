import { finalize, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpResponse } from '@angular/common/http';
import {
    environment
  } from 'src/environments/environment';
@Injectable()
export class LoggingInterceptor implements HttpInterceptor{
    
    intercept(req: import("@angular/common/http").HttpRequest<any>, next: import("@angular/common/http").HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
         const startTime=Date.now();
         let ok: string;
 
         // extend server response observable with logging
         return next.handle(req)
           .pipe(
             tap(
               // Succeeds when there is a response; ignore other events
               event => ok = event instanceof HttpResponse ? '请求成功' : '',
               // Operation failed; error is an HttpErrorResponse
               error => ok = '请求失败'
             ),
             // Log when response observable either completes or errors
             finalize(() => {
               const elapsed = Date.now() - startTime;
               const msg = `${req.method} "${req.urlWithParams}"
                  ${ok} in ${elapsed} ms.`;
              if(!environment.production)
              console.log(msg);
             })
           );
    }

}