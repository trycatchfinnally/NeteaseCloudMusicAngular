import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Md5 } from "ts-md5";
import { User } from "../DominModel/user";
import { DefaultHttpService } from "../service/default-http-service";
import { KeyValue } from "@angular/common";
import { NzModalRef, NzNotificationService } from "ng-zorro-antd";
import { notMatchValidator } from "../shared/notMatchValidator";
import { rePassWordValidator } from "../shared/rePassWordValidator";
import { cellPhoneExist } from "../DominModel/cellPhoneExist";
import { emptyResult } from "../DominModel/emptyResult";

@Component({
  selector: "app-nz-login-modal-custom",
  templateUrl: "./nz-login-modal-custom.component.html",
  styleUrls: ["./nz-login-modal-custom.component.css"],
})
export class NzLoginModalCustomComponent implements OnInit {
  public validateForm: FormGroup;
  public changePassForm: FormGroup;
  public emailLoginFrom: FormGroup;
  public passwordVisible = false;
  public isLoginOkLoading = false;
  public loginErrMsg = "";
  public allowInutCaptcha = false;
  public sendCaptchaRemainSeconds = 0;
  public canSendCaptcha = true;
  //1、手机登录 2、手机密码找回 3、邮箱登录
  public loginType = 1;
  constructor(
    private http: DefaultHttpService,
    private modal: NzModalRef,
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      phoneNum: [null, [Validators.required, Validators.minLength(8)]],
      phonepassword: [null, [Validators.required, Validators.minLength(6)]],
      remember: [true],
    });
  }
  private destroyModal(user: User) {
    this.modal.destroy({
      data: user,
    });
  }
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  public async loginhandleOk() {
    this.isLoginOkLoading = true;
    let data: any;
    let actionName = "LoginByCellPhone";
    if (this.loginType == 1) {
      data = {
        phone: this.validateForm.controls["phoneNum"].value,
        passWord: Md5.hashStr(
          this.validateForm.controls["phonepassword"].value
        ),
        remember: this.validateForm.controls["remember"].value,
      };
    } else  {
      data = {
        email: this.emailLoginFrom.controls["email"].value,
        passWord: Md5.hashStr(
          this.emailLoginFrom.controls["emailpassword"].value
        ),
        remember: this.emailLoginFrom.controls["remember"].value,
      };
      actionName = "LoginByEmail";
    }
    let x = await this.http
      .PostToServer<KeyValue<string, User>>("Login", actionName, data)
      .toPromise();
    this.isLoginOkLoading = false;
    let user = x.value;
    if (user == null) {
      this.loginErrMsg = x.key;
      setTimeout(() => {
        this.loginErrMsg = null;
      }, 3000);
      return;
    }
    this.destroyModal(user);
  }
  public findPass() {
    this.loginType = 2;
    if (this.changePassForm == null) {
      this.changePassForm = this.fb.group(
        {
          phoneNum: [
            null,
            [
              Validators.required,
              Validators.pattern(
                /^(13[0-9]|14[5|7]|15[0-9]|18[0-9]|19[0-9])\d{8}$/
              ),
            ],
          ],
          captcha: [null, [Validators.required, Validators.maxLength(4)]],
          passWord: [
            null,
            [
              Validators.pattern(/^[^\s]+$/),

              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(16),
              notMatchValidator([
                /^[0-9]{6,16}$/,
                /^[a-zA-Z]{6,16}$/,
                /^[^0-9a-zA-Z]+$/,
              ]),
            ],
          ],
          rePassWord: [
            null,
            [Validators.pattern(/^[^\s]+$/), Validators.required],
          ],
        },
        { validators: rePassWordValidator }
      );
    }
  }
  public async changePass() {
    this.isLoginOkLoading = true;
    try {
      let checkResult = await this.http
        .GetFromServer<cellPhoneExist>("Login", "CheckCellPhoneExistence", {
          phone: this.changePassForm.value["phoneNum"],
        })
        .toPromise();
      if (checkResult.exist != 1) {
        this.notification.error("注册错误", "该用户还未注册!");
        return;
      }
      let postBody = {
        captcha: this.changePassForm.value["captcha"],
        phone: this.changePassForm.value["phoneNum"],
        password: Md5.hashStr(this.changePassForm.value["passWord"]),
      };

      try {
        await this.http
          .PostToServerThrow<emptyResult>("Login", "Regiester", postBody)
          .toPromise();
        this.notification.success(
          "成功",
          "修改密码成功，请点击登录按钮重新登录"
        );
        this.destroyModal(null);
      } catch (err) {
        this.notification.error(
          "错误",
          "修改过程发送了错误" + JSON.stringify(err["error"])
        );
      }
    } catch {
      this.notification.error("网络错误", "网络连接失败!");
    } finally {
      this.isLoginOkLoading = false;
    }
  }
  public async sendCaptcha() {
    let cellPhone = this.changePassForm.value["phoneNum"];
    if (
      cellPhone == null ||
      this.changePassForm.get("phoneNum").errors != null
    ) {
      this.notification.error("操作错误", "请先输入正确的手机号码");
      return;
    }
    try {
      await this.http
        .GetFromServer<string>("Login", "SendCaptcha", {
          phone: cellPhone,
        })
        .toPromise();
    } catch (error) {
      this.notification.error("网络错误", "发送验证码失败，请稍后重试");
      return;
    }
    this.allowInutCaptcha = true;
    this.sendCaptchaRemainSeconds = 60;
    this.canSendCaptcha = false;
    while (this.sendCaptchaRemainSeconds > 0) {
      await this.delay(1000);
      this.sendCaptchaRemainSeconds--;
    }
    this.canSendCaptcha = true;
  }
  public emailLogin() {
    this.loginType = 3;
    if (this.emailLoginFrom == null) {
      this.emailLoginFrom = this.fb.group({
        email: [
          null,
          [
            Validators.required,
            Validators.pattern(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/),
          ],
        ],
        emailpassword: [null, [Validators.required, Validators.minLength(6)]],
        remember: [true],
      });
    }
  }
}
