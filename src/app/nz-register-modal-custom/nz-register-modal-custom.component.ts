import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoggerService } from "../service/logger.service";
import { DefaultHttpService } from "../service/default-http-service";
import { rePassWordValidator } from "../shared/rePassWordValidator";
import { cellPhoneExist } from "../DominModel/cellPhoneExist";
import { NzNotificationService, NzModalRef } from "ng-zorro-antd";
import { Md5 } from "ts-md5";
import { emptyResult } from "../DominModel/emptyResult";
import { notMatchValidator } from "../shared/notMatchValidator";

@Component({
  selector: "app-nz-register-modal-custom",
  templateUrl: "./nz-register-modal-custom.component.html",
  styleUrls: ["./nz-register-modal-custom.component.css"]
})
export class NzRegisterModalCustomComponent implements OnInit {
  public registerForm: FormGroup;
  public sendCaptchaRemainSeconds = 0;
  public canSendCaptcha = true;
  public registerProcessing = false;
  public passwordVisible = false;
  public allowInutCaptcha = false;
  constructor(
    private logger: LoggerService,
    private httpService: DefaultHttpService,
    private notification: NzNotificationService,
    private modal: NzModalRef,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        nickName: [
          null,
          [
            Validators.required,
            Validators.maxLength(15),
            Validators.pattern(/^[^\s]+$/)
          ]
        ],
        phoneNum: [
          null,
          [
            Validators.required,
            Validators.pattern(
              /^(13[0-9]|14[5|7]|15[0-9]|18[0-9]|19[0-9])\d{8}$/
            )
          ]
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
              /^[^0-9a-zA-Z]+$/
            ])
          ]
        ],
        rePassWord: [
          null,
          [Validators.pattern(/^[^\s]+$/), Validators.required]
        ]
      },
      { validators: rePassWordValidator }
    );
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  private destroyModal(success: boolean) {
    this.modal.destroy({
      success: success
    });
  }
  public async register() {
    this.logger.LogDebug(this.registerForm.value);

    this.registerProcessing = true;
    try {
      let checkResult = await this.httpService
        .GetFromServer<cellPhoneExist>("Login", "CheckCellPhoneExistence", {
          phone: this.registerForm.value["phoneNum"]
        })
        .toPromise();
      if (checkResult.exist == 1) {
        this.notification.error("注册错误", "该用户已经被注册!");
        return;
      }
      let postBody = {
        captcha: this.registerForm.value["captcha"],
        phone: this.registerForm.value["phoneNum"],
        password: Md5.hashStr(this.registerForm.value["passWord"]),
        nickname: this.registerForm.value["nickName"]
      };

      try {
        await this.httpService
          .PostToServerThrow<emptyResult>("Login", "Regiester", postBody)
          .toPromise();
        this.notification.success(
          "成功",
          "你已成功注册，请点击登录按钮登入你的账号"
        );
        this.destroyModal(true);
      } catch (err) {
        this.notification.error(
          "错误",
          "注册过程发送了错误" + JSON.stringify(err["error"])
        );
      }
    } catch {
      this.notification.error("网络错误", "网络连接失败!");
    } finally {
      this.registerProcessing = false;
    }
  }
  public async sendCaptcha() {
    let cellPhone = this.registerForm.value["phoneNum"];
    if (cellPhone == null || this.registerForm.get("phoneNum").errors != null) {
      this.notification.error("操作错误", "请先输入正确的手机号码");
      return;
    }
    try {
      await this.httpService
        .GetFromServer<string>("Login", "SendCaptcha", {
          phone: cellPhone
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
}
