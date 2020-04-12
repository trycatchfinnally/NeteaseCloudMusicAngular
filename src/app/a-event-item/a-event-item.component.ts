import { Component, OnInit, Input } from "@angular/core";
import { aEvent } from "../DominModel/event";
import { LoggerService } from "../service/logger.service";
import { DefaultHttpService } from "../service/default-http-service";
import { Music } from "../DominModel/music";
import { Router } from "@angular/router";
import { AudioService } from "../service/audio.service";
import { playTrackType } from "../Enums/playTrackType";
import { MusicUrlAvailableCheckerService } from "../service/music-url-available-checker.service";
import { NzMessageService } from "ng-zorro-antd";
import { Album } from "../DominModel/album";
import { PlayListDetail } from "../JsonResultModel/play-list-detail";

@Component({
  selector: "app-a-event-item",
  templateUrl: "./a-event-item.component.html",
  styleUrls: ["./a-event-item.component.css"]
})
export class AEventItemComponent implements OnInit {
  private _thumbsUpbusying = false;
  private _playAlbumBusying = false;
  private _playPlayListBusying = false;
  public eventCommentVisiable = false;
  @Input("aEvent")
  public aEvent: aEvent;

  constructor(
    private httpService: DefaultHttpService,
    private logger: LoggerService,
    private audioService: AudioService,
    private router: Router,
    private musicChecker: MusicUrlAvailableCheckerService,
    private nzMessageService: NzMessageService
  ) {}

  ngOnInit() {}
  private async checkMusicAndPlay(musics: Music[]) {
    await this.musicChecker.CheckMusicsAsync(musics);
    this.audioService.stop();
    this.audioService.displayTrackCollection.splice(
      0,
      this.audioService.displayTrackCollection.length
    );
    musics.forEach(x => this.audioService.displayTrackCollection.push(x));
    let music = musics.find(x => x.available == true);
    if (music == null) music = musics[0];
    this.audioService.play(music);
  }

  public playMusic(music: Music, navFlag?: number) {
    this.audioService.play(music, playTrackType.basicMusic);
    if (navFlag != null) this.router.navigate(["/playdetail"]);
  }
  public replaceMessage(input: string) {
    if (input == null || input.length == 0) return input;
    let re = new RegExp(
      "https{0,1}://([\\w-]+\\.)+[\\w-]+(/#)?(/[\\w-./?%&=]*)?",
      "g"
    );

    input = input.replace(
      re,
      "<a class='smallLink'  href='" +
        "$&" +
        "' target='_blank' >" +
        "我是链接" +
        "</a>"
    );

    let result = "";
    let fucking = false;
    let atUserName = "";
    for (let index = 0; index < input.length; index++) {
      let ch = input.charAt(index);
      if (!fucking) {
        if (ch != "@") result += ch;
        else fucking = true;
      } else {
        if (atUserName.length >= 15) {
          fucking = false;
          result = result + "@" + atUserName;
          atUserName = "";
          continue;
        }
        if (ch != " ") atUserName += ch;
        else {
          fucking = false;
          result =
            result +
            "<a style='color: #0c73c2;' href='https://music.163.com/user/home?nickname=" +
            atUserName +
            "' target='_blank'  >@" +
            atUserName +
            " </a>";
          atUserName = "";
        }
      }
    }

    return result;
  }
  //由于网络影响，可能会等待较长时间,防止重入
  public thumbsUpEvent(aevent: aEvent) {
    if (this._thumbsUpbusying) {
      this.nzMessageService.error("另一个点赞操作正在队列中，请等待完成");
      return;
    }
    this._thumbsUpbusying = true;
    this.httpService
      .GetFromServer<string>("Event", "ThumbsUpEvent", {
        thumbsUp: !aevent.info.liked,
        eventThreadId: aevent.info.threadId,
        id:aevent.id
      })
      .toPromise()
      .then(() => this.nzMessageService.success("点赞成功"))
      .then(() => (aevent.info.liked = !aevent.info.liked))
      .catch(() => this.nzMessageService.error("点赞失败，请稍后重试"))
      .finally(() => (this._thumbsUpbusying = false));
  }
  public async playAlbum(id: number) {
    if (this._playAlbumBusying) {
      this.nzMessageService.error("正在处理上一次播放专辑的请求，请稍后");
      return;
    }
    this._playAlbumBusying = true;
    try {
      let album = await this.httpService
        .GetFromServer<Album>("Album", "GetAlbumDetailById", {
          id
        })
        .toPromise();
      await this.checkMusicAndPlay(album.musics);
    } catch {
      this.nzMessageService.error("播放失败，请稍后重试");
    } finally {
      this._playAlbumBusying = false;
    }
  }
  public async playPlayList(id: number) {
    if (this._playPlayListBusying) {
      this.nzMessageService.error("正在处理上一次播放歌单的请求，请稍后");
      return;
    }
    this._playPlayListBusying = true;
    try {
      let playListDetail = await this.httpService
        .GetFromServer<PlayListDetail>("Playlist", "GetPlaylistById", { id })
        .toPromise();
      await this.checkMusicAndPlay(playListDetail.musics);
    } catch {
      this.nzMessageService.error("播放失败，请稍后重试");
    } finally {
      this._playPlayListBusying = false;
    }
  }

  public replyEvent( ) {
     this.eventCommentVisiable = !this.eventCommentVisiable;
  }
}
