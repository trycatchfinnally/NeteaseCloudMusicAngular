import {
  Injectable
} from '@angular/core';
import {
  LoginServiceService
} from './login-service.service';
import {
  LikeListProviderService
} from './like-list-provider.service';
import {
  NzMessageService
} from 'ng-zorro-antd';
import {
  DefaultHttpService
} from './default-http-service';

@Injectable({
  providedIn: 'root'
})
export class LikeOrDisLikeMusicService {

  constructor(private loginService: LoginServiceService, private likeListProvider: LikeListProviderService,
    private nzMessageService: NzMessageService, private httpService: DefaultHttpService) {}
  private async checkAccess() {
    if (!this.loginService.IsLoginIn) {
      await this.loginService.LoginRequestedAsync();
      if (!this.loginService.IsLoginIn) return false;
    }
    return true;
  }
  public async likeOrNot(musicId: number) {
    if (!await this.checkAccess()) {
      this.nzMessageService.error("你还没有登录额，不能使用喜欢功能！");
      return false;
    }
    let like = !await this.likeListProvider.IsLikedMusicAsync(musicId);
    let fuck = false;
    await this.httpService.GetFromServer < string > ("User", "LikeMusicOrNot", {
        id: musicId,
        like: like
      })
      .toPromise().then(x => this.nzMessageService.info((like ? "喜欢" : "取消喜欢") + "成功！"))
      .then(x => this.likeListProvider.changeLikeListIds(musicId, like))
      .then(() => fuck = true)
      .catch(err => this.nzMessageService.error((like ? "喜欢" : "取消喜欢") + "操作发生了错误，请稍后重试！"));
    return fuck;
  }
}
