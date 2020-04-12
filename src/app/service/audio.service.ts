import { Injectable, ChangeDetectorRef, EventEmitter } from "@angular/core";
import { isNull, error } from "util";
import { DefaultHttpService } from "./default-http-service";
import { Music } from "../DominModel/music";
import { IPlayableModel } from "../DominModel/IPlayableModel";
import { playCycleMode } from "../Enums/playCycleMode";
import { Subject } from "rxjs";
import { distinctUntilChanged, retry, switchMap, filter } from "rxjs/operators";
import { playTrackType } from "../Enums/playTrackType";
import { cloudMusic, cloudDisk } from "../JsonResultModel/cloudDisk";
import { LoggerService } from "./logger.service";

@Injectable({
  providedIn: "root"
})
export class AudioService {
  private _srcLoading = false;
  //代表播放的audioDOM控件
  private audioDomElement: any;
  private _randomIndexs: number[] = [];
  private _currentTrack: IPlayableModel;
  private _playTrackType = playTrackType.basicMusic;
  private _trackCollection: IPlayableModel[] = [];
  //当前播放的循环模式
  public playCycleMode = playCycleMode.repeatAll;
  private _getMusicDetailSubject = new Subject<IPlayableModel>();
  private _trackChangeEventEmitter = new EventEmitter<IPlayableModel>();
  private get nativeDomElement() {
    this.checkAcess();
    return this.audioDomElement;
  }
  //计算下一曲等使用该集合？
  private get availTrackCollection() {
    if (
      this._playTrackType == playTrackType.Fm ||
      this._playTrackType == playTrackType.basicMusic
    )
      return this._trackCollection
        .map(x => x as Music)
        .filter(x => x.available || x.available == null);
    return this._trackCollection;
  }
  public get CurrentPlayTrackType() {
    return this._playTrackType;
  }
  //对外展示的播放项目
  public get displayTrackCollection() {
    return this._trackCollection;
  }
  public set displayTrackCollection(value: IPlayableModel[]) {
    this._trackCollection = value;
  }
  public get volumn() {
    return Math.floor(this.nativeDomElement.volume * 100);
  }
  public set volumn(value: number) {
    this.nativeDomElement.volume = value / 100;
  }
  ///总的时长，以秒为单位
  public get duration(): number {
    if (
      this.nativeDomElement.duration == null ||
      this.nativeDomElement.duration == 0
    )
      return 100;
    return this.nativeDomElement.duration;
  }
  public get muted(): boolean {
    return this.nativeDomElement.muted;
  }
  public set muted(value: boolean) {
    this.nativeDomElement.muted = value;
  }
  //返回当前的播放时间，以秒为单位
  public get currentTime(): number {
    return this.nativeDomElement.currentTime;
  }
  public set currentTime(value: number) {
    this.nativeDomElement.currentTime = value;
  }
  public get ended(): boolean {
    return this.nativeDomElement.ended;
  }
  public get paused(): boolean {
    return this.nativeDomElement.paused;
  }
  public set paused(value: boolean) {
    if (value) this.pause();
    else {
      if (this.currentTrack) this.nativeDomElement.play();
    }
  }
  public get initSuccessd(): boolean {
    return this.audioDomElement != null;
  }
  //
  public get currentTrack() {
    return this._currentTrack;
  }
  public get trackChangeEventEmitter() {
    return this._trackChangeEventEmitter.asObservable();
  }
  //表示是否正在加载路径
  public get srcLoadding() {
    return this._srcLoading;
  }
  constructor(
    private httpService: DefaultHttpService,
    private logger: LoggerService
  ) {
    this.init();
  }
  private init() {
    this._getMusicDetailSubject
      .pipe(
        filter(x => x != null && x.id != 0),
        distinctUntilChanged(),
        switchMap(x =>
          this.httpService.GetFromServer<Music>("Music", "GetMusicDetailById", {
            id: x.id
          })
        ),
        retry(3)
      )
      .subscribe(x => {
        // if (x.url == null) {
        //   this.next();
        // }
        this.nativeDomElement.src = x.url;
        this.nativeDomElement.play();
        this._srcLoading = false;
      });
  }
  //检查audioDomElement是否为null
  private checkAcess() {
    if (!this.audioDomElement)
      throw new Error(
        "使用此服务之前，你必须先调用init为其指定一个合法的audio对象"
      );
  }

  private reCalcRandomIndexRequired() {
    return this._randomIndexs.length != this._trackCollection.length;
  }
  //计算随机序列
  private CalcRandomIndex() {
    this._randomIndexs.splice(0, this._randomIndexs.length);
    let size = this.availTrackCollection.length;
    for (let index = 0; index < size; index++) {
      this._randomIndexs.push(index);
    }
    this._randomIndexs.sort((a, b) => 0.5 - Math.random());
    this.logger.LogDebug(this._randomIndexs);
  }
  //执行下一个的逻辑
  private ChangeNextImpl(forwardDiretion: boolean) {
    let totalLength = this.availTrackCollection.length;
    if (totalLength <= 0) return;
    let step = -1;
    if (forwardDiretion) step = 1;

    let index = this.availTrackCollection.findIndex(
      x => x.id == this.currentTrack.id
    );
    switch (this.playCycleMode) {
      case playCycleMode.repeatAll:
        index = index + step;
        if (index >= totalLength) index = 0;
        else if (index < 0) index = this.availTrackCollection.length - 1;
        break;
      case playCycleMode.random:
        if (this.reCalcRandomIndexRequired()) this.CalcRandomIndex();
        index = this._randomIndexs.indexOf(index);
        index = index + step;
        if (index >= totalLength) index = 0;
        else if (index < 0) index = totalLength - 1;
        index = this._randomIndexs[index];
        break;
      case playCycleMode.repeatOne:
        break;
      case playCycleMode.nothing:
        return;
    }

    this.play(this.availTrackCollection[index]);
  }
  private changePlayType(playType: playTrackType) {
    if (this._playTrackType != playType) {
      this._trackCollection = [];
    }
    this._playTrackType = playType;
    //todo通知
  }

  ///使用指定的控件初始化服务
  public initComponent(audioDomElement: any) {
    if (!audioDomElement) throw new Error("必须是一个合法的对象");
    this.audioDomElement = audioDomElement;
    this._trackCollection.splice(0, this._trackCollection.length);
    this.volumn = 60;
  }

  public play(playableTrack: IPlayableModel, typeDiv?: playTrackType) {
    this.pause();
    this._srcLoading = true;
    if (typeDiv == null) typeDiv = playTrackType.basicMusic;
    if (!playableTrack || playableTrack.id == 0)
      throw new Error("需要播放的文件不合法");
    this.changePlayType(typeDiv);
    if (
      this._trackCollection.findIndex(x => x.id == playableTrack.id) == -1 &&
      this._playTrackType != playTrackType.Fm
    )
      this._trackCollection.push(playableTrack);
    this._currentTrack = playableTrack;
    this._trackChangeEventEmitter.emit(this._currentTrack);
    this._getMusicDetailSubject.next(playableTrack);
  }
  public stop() {
    this.pause();
    this.nativeDomElement.currentTime = 0;
  }
  public pause() {
    this.nativeDomElement.pause();
  }
  public next() {
    this.logger.LogDebug("调用了下一曲 at: " + new Date().toTimeString());
    this.pause();
    this._srcLoading = true;
    this.ChangeNextImpl(true);
  }
  public previous() {
    this.pause();
    this._srcLoading = true;
    this.ChangeNextImpl(false);
  }
}
