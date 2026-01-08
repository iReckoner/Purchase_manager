import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
// import  {popupserviceComponent} from ''
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    debugger
    const token = JSON.parse(localStorage.getItem('accessToken')!);
    const username = localStorage.getItem('savedEmail');
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          Username: username || ''   ,
          apptype:"PurchaseManager" // 🔑 send username in header
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          // alert('You are already logged in from another device');
          // this.popupService.open(
          //   'You are already logged in from another device. Do you want to continue?'
          // );
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }


}
