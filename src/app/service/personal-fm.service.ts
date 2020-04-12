import { Injectable } from "@angular/core";
import { LoggerService } from "./logger.service";
import { DefaultHttpService } from "./default-http-service";
import { LoginServiceService } from "./login-service.service";
import { AudioService } from "./audio.service";
import { Music } from "../DominModel/music";
import { playTrackType } from "../Enums/playTrackType";
import { NzMessageService } from "ng-zorro-antd";

@Injectable({
  providedIn: "root",
})
export class PersonalFMService {
  private innerCollection: Music[] = [];
  private busy = false;
  constructor(
    private logger: LoggerService,
    private audioService: AudioService,
    private httpService: DefaultHttpService,
    private loginService: LoginServiceService,
    private nzMessageService: NzMessageService
  ) {}
  private requestNextFromServe() {
    this.logger.LogDebug("开始请求下一批次");
    return this.httpService
      .GetFromServer<Music[]>("User", "GetPersonalFm", {})
      .toPromise();
  }
  public async startAsync() {
    if (!this.loginService.IsLoginIn) {
      await this.loginService.LoginRequestedAsync();
      if (!this.loginService.IsLoginIn) return;
    }
    this.innerCollection = await this.requestNextFromServe();
    if (this.innerCollection.length > 0)
      this.audioService.play(this.innerCollection[0], playTrackType.Fm);
  }
  public async nextRequestAsync() {
    this.logger.LogDebug("请求了一次下一个");
    if (this.busy) {
      this.logger.LogDebug("请求繁忙，请稍后");
      return;
    }
    this.busy = true;
    let index = this.innerCollection.indexOf(
      this.audioService.currentTrack as Music
    );
    try {
      if (
        this.innerCollection.length == 0 ||
        index < 0 ||
        index == this.innerCollection.length - 1
      ) {
        this.innerCollection = await this.requestNextFromServe();
        this.audioService.play(this.innerCollection[0], playTrackType.Fm);
      } else {
        this.audioService.play(
          this.innerCollection[index + 1],
          playTrackType.Fm
        );
      }
    } catch (err) {
      this.nzMessageService.error("发生了一些错误，请点击下一曲重试");
      this.logger.LogError(err);
    } finally {
      this.busy = false;
    }
  }
  //将给定的音乐丢入垃圾桶
  public trashFm(fmMusic: Music) {
    this.httpService
      .GetFromServer<string>("User", "TrashPersonalFm", { id: fmMusic.id })
      .toPromise()
      .then(async (x) => {
        this.nzMessageService.info(
          "将音乐{" + fmMusic.name + "}丢入垃圾桶失成功！"
        );
        await this.nextRequestAsync();
      })
      .catch(() =>
        this.nzMessageService.error(
          "将音乐{" + fmMusic.name + "}丢入垃圾桶失败，请重试！"
        )
      );
  }
}
