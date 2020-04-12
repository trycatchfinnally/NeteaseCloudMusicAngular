import { SelectableMusic } from "../DominModel/SelectableMusic";
import { AudioService } from "./audio.service";

import { Music } from "../DominModel/music";
import { LikeListProviderService } from "./like-list-provider.service";
import { LoginServiceService } from "./login-service.service";
import { LikeOrDisLikeMusicService } from "./like-or-dis-like-music.service";
import { MusicUrlAvailableCheckerService } from "./music-url-available-checker.service";
import { NzNotificationService } from "ng-zorro-antd";
import { playTrackType } from "../Enums/playTrackType";
import { LoggerService } from "./logger.service";

export class AddtoplayService {
  private _data: SelectableMusic[] = [];
  private _audioService: AudioService;
  private _likeListProvider: LikeListProviderService;
  private _likeMusicService: LikeOrDisLikeMusicService;
  private _availableChecked: MusicUrlAvailableCheckerService;
  private _nzNotificationService: NzNotificationService;
  private _logger: LoggerService;
  private _isSelectMode = false;
  //表示是否正在选择，及出现多选框
  public get isSelectMode() {
    return this._isSelectMode;
  }
  //表示对应的列表数据
  public get data() {
    return this._data;
  }
  constructor(
    audioService: AudioService,
    likelistProvider: LikeListProviderService,
    loginService: LoginServiceService,
    likeMusicService: LikeOrDisLikeMusicService,
    availableChecker: MusicUrlAvailableCheckerService,
    nzNotificationService: NzNotificationService,
    logger: LoggerService
  ) {
    this._audioService = audioService;
    this._likeListProvider = likelistProvider;
    loginService.loginStateChanged.subscribe((_x) =>
      this._likeListProvider.IsLikeMusics(this._data)
    );
    this._likeMusicService = likeMusicService;
    this._availableChecked = availableChecker;
    this._nzNotificationService = nzNotificationService;
    this._logger = logger;
  }
  private checkAccess(musics: Music[]) {
    if (musics == null || musics.length < 0) throw new Error("参数错误！");
  }
  //表示对应的载入操作，即对应的歌曲
  public async initAsync(musics: Music[]) {
    this.checkAccess(musics);
    this._data = musics.map((x) => x as SelectableMusic);
    this._logger.LogDebug("初始化,新加入歌曲" + this._data.length + "首");
    this._isSelectMode = false;
    this._likeListProvider.IsLikeMusics(this._data);
    return this._availableChecked.CheckMusicsAsync(this._data);
  }
  //表示在选择模式和非选择模式之间切换
  public changeSelectMode() {
    if (this._isSelectMode) {
      let selected: SelectableMusic[] = [];
      this._data.forEach((element) => {
        if (element.isSelected) selected.push(element);
      });

      if (selected.length > 0) {
        this._audioService.stop();
        this._audioService.displayTrackCollection.splice(
          0,
          this._audioService.displayTrackCollection.length
        );
        selected.forEach((x) =>
          this._audioService.displayTrackCollection.push(x)
        );
        this._audioService.play(selected[0]);
      }
    }
    this._isSelectMode = !this._isSelectMode;
  }
  //表示列表项目的选择操作，可能是选择也可能是直接播放
  public seleteOrPlay(music: SelectableMusic) {
    if (this._isSelectMode) music.isSelected = !music.isSelected;
    else {
      if (music.available != null && !music.available) {
        this._nzNotificationService.error(
          "无效操作",
          "受版权方要求，该资源暂时下架"
        );
        return;
      }
      this._audioService.play(music);
    }
  }
  //表示播放全部的命令
  public playAll() {
    this.checkAccess(this._data);
    this._audioService.stop();
    this._audioService.displayTrackCollection.splice(
      0,
      this._audioService.displayTrackCollection.length
    );
    let music = this._data.find((x) => x.available == true);
    if (music == null) music = this._data[0];
    this._audioService.play(music, playTrackType.basicMusic);
    this._audioService.displayTrackCollection = this._data;
  }
  //表示前面的爱心
  public likeOrHateClick(music: SelectableMusic) {
    this._likeMusicService
      .likeOrNot(music.id)
      .then(() => (music.isLike = !music.isLike));
  }
}
