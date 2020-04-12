import { Injectable, OnInit, EventEmitter } from "@angular/core";
import { User } from "../DominModel/user";
import { NzModalService, NzNotificationService } from "ng-zorro-antd";

import { NzLoginModalCustomComponent } from "../nz-login-modal-custom/nz-login-modal-custom.component";
import { Router } from "@angular/router";
import { DefaultHttpService } from "./default-http-service";
import { LoggerService } from "./logger.service";

const loginUserKey = "loginUserInfo";
@Injectable({
  providedIn: "root",
})
export class LoginServiceService {
  private _isLoginIn = false;
  private _loginUser: User = null;
  private _loginStateChanged = new EventEmitter<boolean>();
  public get loginUser() {
    return this._loginUser;
  }
  public get loginStateChanged() {
    return this._loginStateChanged.asObservable();
  }

  public get IsLoginIn() {
    return this._isLoginIn;
  }
  public set IsLoginIn(value: boolean) {
    this._isLoginIn = value;
    this._loginStateChanged.next(value);
  }
  constructor(
    private modalService: NzModalService,
    private router: Router,
    private logger: LoggerService,
    private http: DefaultHttpService,
    private nzNotificationService: NzNotificationService
  ) {
    this.InitAsync();
  }

  private async InitAsync() {
    let cookie = document.cookie;
    if (cookie != null && cookie.length > 0) {
      let userIdString = localStorage.getItem(loginUserKey);
      this.logger.LogDebug("从本地获取的用户id为:" + userIdString);
      if (userIdString != null && userIdString.length > 0) {
        try {
          let temp = await this.http
            .GetFromServer<User>("User", "GetUserById", { id: userIdString })
            .toPromise();
          this._loginUser = temp;
          this.IsLoginIn = true;
        } catch {
          this.IsLoginIn = true;
          this.delCookie();
        }
      } else {
        this.logger.LogDebug("未发现本地缓存数据，登录失败");

        this.delCookie();
      }
    }
  }
  private delCookie() {
    this.http
      .PostToServerThrow<string>("Common", "ClearCookie", {})
      .toPromise()
      .then(() => this.logger.LogDebug("成功移除cookie"))
      .catch(() => this.logger.LogInfo("移除cookie失败？？"));
  }
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  public async LoginRequestedAsync(redirectUrl?: string) {
    let temp = this.modalService.create({
      nzTitle: "登录",
      nzContent: NzLoginModalCustomComponent,
      nzFooter: null,
      nzWidth: 400,
    });
    let fuck = true;
    temp.afterClose.subscribe((x) => {
      if (x != null && x.data != null) {
        let user: User = x.data;
        this._loginUser = user;
        this.IsLoginIn = true;
        localStorage.setItem(loginUserKey, user.userId.toString());
        if (redirectUrl != null) this.router.navigate([redirectUrl]);
      } else {
        // this._loginUser = null;
        // this.IsLoginIn = false;
      }
      fuck = false;
    });
    while (fuck) {
      await this.delay(200);
    }
    this.logger.LogDebug("登录请求已退出");
    if (this.IsLoginIn)
      this.nzNotificationService.success("登录", "登录成功！");
  }
  public LogOut() {
    this.http.GetFromServer<string>("Login", "Logout", {}).subscribe((x) => {
      this.logger.LogDebug(x);
      localStorage.removeItem(loginUserKey);
      this.IsLoginIn = false;
      document.cookie = "";
      this.nzNotificationService.info("登录", "已退出登录");
    });
  }
}
