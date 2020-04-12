import { Injectable } from "@angular/core";
import { Inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { NzMessageService } from "ng-zorro-antd";
import { Router, ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class DefaultHttpService {
  constructor(
    private http: HttpClient,

    private messageService: NzMessageService,
    @Inject("BASE_URL") private baseUrl: string
  ) {}
  public GetFromServer<T>(
    controlName: string,
    actionName: string,
    data: any
  ): Observable<T> {
    let testBasicUrl = this.baseUrl;
    let url = `${testBasicUrl}api/${controlName}/${actionName}`;

    Object.keys(data).forEach((x, i) => {
      if (i == 0) {
        url += `/?${x}=${data[x]}`;
      } else {
        url += `&${x}=${data[x]}`;
      }
    });
    return this.http
      .get<T>(url )
      .pipe(retry(3), catchError(this.handleError));
  }
  public PostToServer<T>(
    controlName: string,
    actionName: string,
    data: any
  ): Observable<T> {
    let url = `${this.baseUrl}api/${controlName}/${actionName}`;
    return this.http.post<T>(url, data).pipe(
      retry(3),
      catchError(x => {
        this.messageService.error("网络请求失败");
        return new Observable<T>();
      })
    );
  }
  public PostToServerThrow<T>(
    controlName: string,
    actionName: string,
    data: any
  ) {
    let url = `${this.baseUrl}api/${controlName}/${actionName}`;
    return this.http.post<T>(url, data).pipe(retry(3));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
  
    if (error.status == 404) window.location.href = "#notfound";
    // return an observable with a user-facing error message
    return throwError(error.message);
  }
}
