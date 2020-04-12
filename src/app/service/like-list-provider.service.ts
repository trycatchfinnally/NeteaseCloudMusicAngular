import {
  Injectable
} from '@angular/core';
import {
  LoginServiceService
} from './login-service.service';
import {
  Music
} from '../DominModel/music';
import {
  DefaultHttpService
} from './default-http-service';
import {
  LoggerService
} from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class LikeListProviderService {
  private userLikeListIds: number[] = [];
  private isReady = false;
  constructor(private loginService: LoginServiceService, private httpService: DefaultHttpService, private logger: LoggerService) {
    this.loginService.loginStateChanged.subscribe(x => {
      if (x) {
        this.isReady = false;
        this.netWorkRequestAsync().then(y => {
          this.userLikeListIds = y;

        });
      } else this.userLikeListIds = [];
    });
  }
  private netWorkRequestAsync() {
    this.logger.LogDebug("开始确定状态" + this.isReady);
    //在批量验证的时候调用一下，防止并发的时候多次请求网络？
    if (this.isReady || !this.loginService.IsLoginIn) return Promise.resolve(this.userLikeListIds);
    return this.httpService.GetFromServer < number[] > ("User", "GetUserLikeList", {
      id: this.loginService.loginUser.userId
    }).toPromise().then(x => {
      this.isReady = true;
      return x;
    });
  }
  //喜欢或者取消喜欢歌曲后，需要重新更新列表
  public changeLikeListIds(id: number, add: boolean) {
    this.logger.LogDebug({
      id,
      add
    });
    if (add) this.userLikeListIds.push(id);
    else {
      let index = this.userLikeListIds.indexOf(id);
      this.userLikeListIds.splice(index, 1);
    }
  }
  //根据歌曲id判断是否该歌曲是否属于喜欢的范围
  public async IsLikedMusicAsync(id: number) {
    if (!this.loginService.IsLoginIn) return false;

    //有可能第一次请求网络发生了错误，这时需要重新进行一次操作
    if (!this.isReady) {
      await this.netWorkRequestAsync();
    }


    if (this.userLikeListIds == null || this.userLikeListIds.length == 0) return false;
    return this.userLikeListIds.indexOf(id) >= 0;
  }
  public IsLikeMusics(musics: Music[]) {

    this.netWorkRequestAsync().then(aa => {
      this.userLikeListIds = aa; //有可能确实还未ready，也就是还为给userLikeListIds赋值，这时候如果没有这个操作会导致后面出来的全是false
      let temp = musics.map(async x => {
        return {
          key: x,
          value: await this.IsLikedMusicAsync(x.id)
        };

      });
      for (const item of temp)
        item.then(x => {
          x.key.isLike = x.value;
        });
    });
  }
}
