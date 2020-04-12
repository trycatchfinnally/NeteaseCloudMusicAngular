import { Injectable } from "@angular/core";
import { LoggerService } from "./logger.service";
import { Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd";
import { DefaultHttpService } from "./default-http-service";
import { NzLoginModalCustomComponent } from "../nz-login-modal-custom/nz-login-modal-custom.component";
import { NzRegisterModalCustomComponent } from "../nz-register-modal-custom/nz-register-modal-custom.component";

@Injectable({
  providedIn: "root"
})
export class RegisterService {
  constructor(
    private modalService: NzModalService,
    private router: Router,
    private logger: LoggerService,
  ) {}
  public async RegisterRequestAsync() {
    this.modalService
      .create({
        nzTitle: "注册",
        nzContent: NzRegisterModalCustomComponent,
        nzFooter: null,
        nzWidth: 500
      })
      .afterClose.subscribe(x => {
        if (x!=null&& x.success) {
          this.router.navigate(["changeUserInfo"]);
        }
      });
  }
}
