import { Component, OnInit } from "@angular/core";
import { LoggerService } from "../service/logger.service";
import { DefaultHttpService } from "../service/default-http-service";
import { Province } from "../DominModel/province";
import { forEach } from "@angular/router/src/utils/collection";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { User } from "../DominModel/user";
import { LoginServiceService } from "../service/login-service.service";
import { NzNotificationService } from "ng-zorro-antd";

@Component({
  selector: "app-change-user-info",
  templateUrl: "./change-user-info.component.html",
  styleUrls: ["./change-user-info.component.css"]
})
export class ChangeUserInfoComponent implements OnInit {
  public validateForm: FormGroup;
  public proviceAndCitys = [];
  public changeProgressing = false;
  constructor(
    private logger: LoggerService,
    private httpService: DefaultHttpService,
    private loginService: LoginServiceService,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initAsync();
  }
  private async initAsync() {
    await this.httpService
      .GetFromServer<Province[]>("User", "ProvinceList", {})
      .toPromise()
      .then(x => {
        this.proviceAndCitys = x.map(y => {
          return {
            value: y.id.toString(),
            label: y.name,
            children: y.citys.map(z => {
              return { value: z.id.toString(), label: z.name, isLeaf: true };
            })
          };
        });
      });
    this.httpService
      .GetFromServer<User>("User", "GetUserEditInfo", {
        id: this.loginService.loginUser.userId
      })
      .toPromise()
      .then(x => {
        this.validateForm = this.fb.group({
          nickname: [
            x.userName,
            [Validators.required, Validators.maxLength(15),Validators.pattern("[^\\s]{1,15}")]
          ],
          birthday: [x.birthday.toString(), [Validators.required]],
          gender: [x.gender.toString(), [Validators.required]],
          region: [[x.province, x.city], [Validators.required]],
          signature: [x.signature, [Validators.maxLength(140)]]
        });
      });
  }
  public submit() {
    let data = {
      avatarImgId: 0,
      province: this.validateForm.value["region"][0],
      city: this.validateForm.value["region"][1],
      gender: this.validateForm.value["gender"],
      nickname: this.validateForm.value["nickname"],
      signature: this.validateForm.value["signature"],
      birthday: 0
    };
    let temp = new Date(this.validateForm.value["birthday"].toString());
    data.birthday = Date.UTC(
      temp.getFullYear(),
      temp.getMonth(),
      temp.getDate()
    );
    this.logger.LogDebug(data);
    this.changeProgressing = true;
    this.httpService
      .PostToServerThrow<string>("User", "UpdateUser", data)
      .toPromise()
      .then(() =>
        this.notification.success(
          "更改信息成功",
          "你已成功修改个人信息，马上为你跳转到主页!"
        )
      )
      .catch(err => {
        this.notification.error(
          "错误",
          "更改个人信息发生了一些不好的错误,错误详情："+JSON.stringify( err["error"])
        );
         
      })
      .finally(() => (this.changeProgressing = false));
  }
}
