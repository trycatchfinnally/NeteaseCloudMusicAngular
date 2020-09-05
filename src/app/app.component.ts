import { Component, ViewChild, TemplateRef } from "@angular/core";
import { LoginServiceService } from "./service/login-service.service";
import { DefaultHttpService } from "./service/default-http-service";
import { PlayList } from "./DominModel/play-list";
import { KeyValue } from "@angular/common";
import { loginUserPlayListPageInfo } from "./DominModel/pageInfo";
import {
  NzModalService,
  NzIconService,
  NzDropdownService,
  NzDropdownContextComponent,
  NzMessageService
} from "ng-zorro-antd";
import { LoggerService } from "./service/logger.service";
import { emptyResult } from "./DominModel/emptyResult";
import { AddtoplayService } from "./service/addtoplay.service";
import { PlayListDetail } from "./JsonResultModel/play-list-detail";
import { AddToPlayServiceFactoryService } from "./service/add-to-play-service-factory.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private _createPlaylistName = "";
  private userPlayListPageInfo: loginUserPlayListPageInfo;
  private dropDown: NzDropdownContextComponent;
  private addToPlayService: AddtoplayService;
  //表示左边的汉堡菜单是否打开
  public drawervisible = false;
  //用来控制创建歌单的对话框是否打开
  public createPlaylistVisible = false;
  //表示创建歌单的对话框中的复选框状态
  public isPrivatePlaylist = false;
  //表示是否正在提交中
  public isSubmitting = false;
  //表示是否在提交后发送错误
  public isSubmitWithError = false;
  //表示新建的歌单的名称
  public get createPlaylistName() {
    return this._createPlaylistName;
  }
  public set createPlaylistName(value: string) {
    this._createPlaylistName = value;
    this.isSubmitWithError = false;
  }
  //表示用户创建的歌单
  public get userCreatedPlaylist() {
    if (!this.loginServerice.IsLoginIn) return [];
    if (this.userPlayListPageInfo == null) return [];
    if (this.loginServerice.loginUser == null) return [];
    return this.userPlayListPageInfo.data.filter(
      x => x.createUser.userId == this.loginServerice.loginUser.userId
    );
  }
  //表示用户收藏的歌单
  public get userCollectionPlaylist() {
    if (!this.loginServerice.IsLoginIn) return [];
    if (this.userPlayListPageInfo == null) return [];
    if (this.loginServerice.loginUser == null) return [];
    return this.userPlayListPageInfo.data.filter(
      x => x.createUser.userId != this.loginServerice.loginUser.userId
    );
  }
  @ViewChild("drawer", { static: false }) drawer: any;
  constructor(
    private addToPlayServiceFactory: AddToPlayServiceFactoryService,
    private nzDropdownService: NzDropdownService,
    private nzMessageService: NzMessageService,
    public loginServerice: LoginServiceService,
    private httpService: DefaultHttpService,
    private modalService: NzModalService,
    private iconService: NzIconService,
    private logger: LoggerService
  ) {
    this.userPlayListPageInfo = new loginUserPlayListPageInfo(httpService);
    this.addToPlayService = this.addToPlayServiceFactory.createAddToPlayService();
    this.loginServerice.loginStateChanged.subscribe(x => {
      if (x) {
        this.userPlayListPageInfo.init(this.loginServerice.loginUser.userId);
      } else this.userPlayListPageInfo.clear();
    });
    this.iconService.fetchFromIconfont({
      scriptUrl: "https://at.alicdn.com/t/font_1368309_ainxci6xwb.js"
    });
  }
  public drawerbuttonClick() {
    this.drawervisible = true;
  }
  public closedrawer() {
    this.drawervisible = false;
  }
  public createPlaylisthandleOk() {
    this.isSubmitting = true;

    let createPlaylistType = 0;
    if (this.isPrivatePlaylist) createPlaylistType = 10;
    this.httpService
      .GetFromServer<PlayList>("User", "CreatePlayList", {
        name: this.createPlaylistName,
        createPlaylistType: createPlaylistType
      })
      .subscribe(
        () => {
          this.createPlaylistVisible = false;
          this.isSubmitting = false;
          this.userPlayListPageInfo.init(this.loginServerice.loginUser.userId);
        },
        () => {
          this.isSubmitting = false;
          this.isSubmitWithError = true;
        }
      );
  }
  public showDeleteConfirm() {
    this.modalService.confirm({
      nzTitle: "确定删除此歌单?",
      nzContent: '<b style="color: red;">删除后，将不能恢复！</b>',
      nzOkText: "确定",
      nzOkType: "danger",
      nzOnOk: () => this.logger.LogInfo("Ok"),
      nzCancelText: "取消"
    });
  }
  public contextMenu($event: MouseEvent, template: TemplateRef<void>) {
    this.dropDown = this.nzDropdownService.create($event, template);
  }
  public close() {
    if (this.dropDown != null) this.dropDown.close();
  }
  public playImmediately(playlistId: number) {
    this.logger.LogDebug("立即播放歌单:" + playlistId);
    this.httpService
      .GetFromServer<PlayListDetail>("Playlist", "GetPlaylistById", {
        id: playlistId,
      })
      .subscribe(
        (x) => {
          this.addToPlayService
            .initAsync(x.musics)
            .then(() => this.addToPlayService.playAll());
        },
        () => this.nzMessageService.error("网络请求失败,播放歌单歌曲失败!")
      );
  }
  public sharePlaylist(playlist: PlayList) {}
  public deletePlaylist(playlist: PlayList) {
    this.modalService.confirm({
      nzTitle: "删除歌单",
      nzContent: "确定删除歌单:<strong>" + playlist.name + "</strong>?",
      nzOnOk: () => {
        this.httpService
          .GetFromServer<emptyResult>("Playlist", "DeletePlayList", {
            id: playlist.id
          })
          .toPromise()
          .then(() => this.nzMessageService.info("删除歌单成功!"))
          .catch(x =>
            this.nzMessageService.error("删除歌单失败,错误信息:" + x)
          );
      }
    });
  }
}
