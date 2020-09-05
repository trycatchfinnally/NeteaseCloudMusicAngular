import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AudioService } from "../service/audio.service";
import { Music } from "../DominModel/music";
import { CollectionService } from "../service/collection.service";
import { DefaultHttpService } from "../service/default-http-service";
import { Lyric } from "../JsonResultModel/Lyric";

import { Observable, Subject, Subscription } from "rxjs";
import { PlayList } from "../DominModel/play-list";

import { Router } from "@angular/router";
import {
  switchMap,
  distinctUntilChanged,
  retry,
  debounceTime,
  share
} from "rxjs/operators";
import { IPlayableModel } from "../DominModel/IPlayableModel";
import { cloudMusic } from "../JsonResultModel/cloudDisk";
import { playTrackType } from "../Enums/playTrackType";
import { LikeOrDisLikeMusicService } from "../service/like-or-dis-like-music.service";
import { NzMessageService } from "ng-zorro-antd";
import { LoggerService } from "../service/logger.service";
import { PersonalFMService } from "../service/personal-fm.service";
const INTERVAL = 500;

@Component({
  selector: "app-play-panel",
  templateUrl: "./play-panel.component.html",
  styleUrls: ["./play-panel.component.css"]
})
export class PlayPanelComponent implements OnInit {
  @ViewChild("lrcUl", { static: true }) lrcUl: ElementRef;
  public lyrics: Lyric[] = [];
  public isMouseOver = false;
  public isLrcLoading = false;
  public containThisMusic: PlayList[] = [];

  //public simiMusics$: Observable < Music[] >|null=null ;
  public simiMusics: Music[] = [];

  private _simiMusicSubject = new Subject<number>();
  private _containThisMusicSubject = new Subject<number>();
  private _lyricSubject = new Subject<number>();
  private _subs: Subscription[] = [];
  constructor(
    private logger: LoggerService,
    public audioService: AudioService,
    private httpService: DefaultHttpService,
    private nzMessageService: NzMessageService,
    private personalFMService: PersonalFMService,
    private collectionService: CollectionService,
    private likeService: LikeOrDisLikeMusicService
  ) {}
  private get someHelpMusic() {
    if (this.audioService.CurrentPlayTrackType == playTrackType.basicMusic)
      return this.audioService.currentTrack;
    if (
      this.audioService.CurrentPlayTrackType == playTrackType.cloudDiskMusic
    ) {
      let temp = this.audioService.currentTrack as cloudMusic;
      return temp.simpleMusic;
    }
    return null;
  }
  public get currentMusic() {
    // return this.audioService.currentTrack;
    if (this.someHelpMusic != null) return this.someHelpMusic as Music;
    return this.audioService.currentTrack as Music;
  }
  public get commentThreadId() {
    if (this.currentMusic != null) return "R_SO_4_" + this.currentMusic.id;
    return null;
  }
  ngOnInit() {
    //相似音乐部分
    this._subs.push(
      this._simiMusicSubject
        .pipe(
          debounceTime(200),
          distinctUntilChanged(),
          switchMap(id =>
            this.httpService.GetFromServer<Music[]>("Music", "GetSimiMusic", {
              id: id
            })
          ),
          share()
        )
        .subscribe(x => {
          // this.simiMusics.splice(0, this.simiMusics.length);
          // x.map(y => this.simiMusics.push(y));
          this.simiMusics = x;
        })
    );
    //包含这首歌曲的歌单subject
    this._subs.push(
      this._containThisMusicSubject
        .pipe(
          distinctUntilChanged(),
          retry(3),
          switchMap(id =>
            this.httpService.GetFromServer<PlayList[]>(
              "Music",
              "GetSimiPlayList",
              {
                id: id
              }
            )
          )
        )
        .subscribe(x => {
          // this.containThisMusic.splice(0, this.containThisMusic.length);
          // x.map(y => this.containThisMusic.push(y));
          this.containThisMusic = x;
        })
    );
    //歌词
    this._subs.push(
      this._lyricSubject
        .pipe(
          distinctUntilChanged(),
          retry(3),
          switchMap(id =>
            this.httpService.GetFromServer<Lyric[]>(
              "Music",
              "GetLyricByMusicId",
              {
                id: id
              }
            )
          )
        )
        .subscribe(
          x => {
            this.lyrics.splice(0, this.lyrics.length);
            x.map(y => this.lyrics.push(y));
            this.isLrcLoading = false;
          },
          err => {
            this.nzMessageService.error("歌词加载错误");
            this.isLrcLoading = false;
          }
        )
    );

    this.changeMusicBathc(this.audioService.currentTrack);

    this._subs.push(
      this.audioService.trackChangeEventEmitter.subscribe(x => {
        this.changeMusicBathc(x);
      })
    );
    //歌词下滑
    setInterval(() => {
      let lis = this.lrcUl.nativeElement.getElementsByTagName("li");
      if (lis.length <= 0) return;
      let temp = this.calcHighLightLine();
      for (let index = 0; index < lis.length; index++) {
        const element = lis[index];
        if (index == temp) {
          element.style.color = "brown";
        } else {
          element.style.color = "black";
        }
      }
      if (!this.isMouseOver)
        this.lrcUl.nativeElement.scrollTop = this.calcScrollTop(lis[temp]);
    }, INTERVAL);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    //  this.audioService.trackChangeEventEmitter.unsubscribe();
    //this._simiMusicSubject.unsubscribe();
    //this._containThisMusicSubject.unsubscribe();
    this._subs.forEach(x => {
      if (x != null && !x.closed) x.unsubscribe();
    });
  }

  public topPartControlClick(index: number) {
    switch (index) {
      case 0:
        this.logger.LogInfo("点击了收藏音乐");
        this.collectionService.collectionMusic(this.currentMusic.id);
        break;
      case 1:
        //喜欢
        this.logger.LogDebug("点击了喜欢音乐");
        let music = this.currentMusic as Music;
        if (music != null)
          this.likeService.likeOrNot(this.currentMusic.id).then(x => {
            if (x) music.isLike = !music.isLike;
          });

        break;
      case 2:
        //下载
        break;
      default:
        break;
    }
  }
  //点击歌词后跳转到歌词对应的进度
  public lrcClick(index: number) {
    if (index < 0 || index > this.lyrics.length)
      throw new Error("ArgumentOutOfRangeException");
    let lrc = this.lyrics[index];
    let seconds = this.convertTimeSpan2Seconds(lrc.time);
    this.audioService.currentTime = seconds;
  }
  //点击相似音乐后播放
  public simiMusicClick(music: Music) {
    this.audioService.play(music);
  }
  public trashFMClick() {
    this.personalFMService.trashFm(this.currentMusic);
  }
  public async fMNextClick() {
    await this.personalFMService.nextRequestAsync();
  }
  private convertTimeSpan2Seconds(timeSpanString: string) {
    let array = timeSpanString.split(":");
    if (array.length != 3) throw new Error("输入字符串不合法");
    let h = +array[0];
    let m = +array[1];
    let s = +array[2];
    let totalseconds = s + m * 60 + h * 3600;
    return totalseconds;
  }
  private calcHighLightLine() {
    let minOffset = 10e8;
    let highLightRowIndex = 0;
    let temp = 0;
    for (let index = 0; index < this.lyrics.length; index++) {
      temp = this.convertTimeSpan2Seconds(this.lyrics[index].time);
      temp = Math.abs(temp - this.audioService.currentTime);
      if (temp <= minOffset) {
        minOffset = temp;
        highLightRowIndex = index;
      }
      //  console.log(    );
    }
    return highLightRowIndex;
  }
  private calcScrollTop(element: any) {
    if (!element) return 0;
    let clientHeight: number = this.lrcUl.nativeElement.clientHeight;
    let scrollHeight: number = this.lrcUl.nativeElement.scrollHeight;
    let offsetTop: number = element.offsetTop;
    if (offsetTop <= 0.4 * clientHeight) return 0;
    else if (offsetTop > scrollHeight - 0.6 * clientHeight)
      return scrollHeight - clientHeight;
    return offsetTop - 0.4 * clientHeight;
  }
  //批量触发subject
  private changeMusicBathc(musicOrCloudMusic: IPlayableModel) {
    //当是基本音乐或者fm的时候 调用相同逻辑
    if (
      this.audioService.CurrentPlayTrackType == playTrackType.basicMusic ||
      this.audioService.CurrentPlayTrackType == playTrackType.Fm
    ) {
      this.isLrcLoading = true;
      this.lyrics = [];
      this._lyricSubject.next(musicOrCloudMusic.id);
      this._simiMusicSubject.next(musicOrCloudMusic.id);
      this._containThisMusicSubject.next(musicOrCloudMusic.id);
    } else if (
      this.audioService.CurrentPlayTrackType == playTrackType.cloudDiskMusic
    ) {
      let tempCloudMusic = musicOrCloudMusic as cloudMusic;
      if (
        tempCloudMusic.simpleMusic == null ||
        tempCloudMusic.simpleMusic.id == 0
      ) {
        this.lyrics = [];
        this.simiMusics = [];
        this.containThisMusic = [];
        return;
      }
      this._lyricSubject.next(tempCloudMusic.simpleMusic.id);
      this._simiMusicSubject.next(tempCloudMusic.simpleMusic.id);
      this._containThisMusicSubject.next(tempCloudMusic.simpleMusic.id);
    }
  }
}
