import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  DefaultHttpService
} from '../service/default-http-service';
import {
  loginUserPlayListPageInfo
} from '../DominModel/pageInfo';
import {
  LoginServiceService
} from '../service/login-service.service';
import {
  NzModalRef,
  NzMessageService
} from 'ng-zorro-antd';
import {
  PlayList
} from '../DominModel/play-list';
import { emptyResult } from '../DominModel/emptyResult';

@Component({
  selector: 'app-nz-collect-music-modal-custom',
  templateUrl: './nz-collect-music-modal-custom.component.html',
  styleUrls: ['./nz-collect-music-modal-custom.component.css']
})
export class NzCollectMusicModalCustomComponent implements OnInit {
  private _userPlayList: PlayList[] = [];
  public userPlayListPageInfo:loginUserPlayListPageInfo;
  @Input() musicId: number;
  constructor(private httpService: DefaultHttpService, private messageService: NzMessageService,
    private loginService: LoginServiceService, private modal: NzModalRef) {
    this.userPlayListPageInfo = new loginUserPlayListPageInfo(this.httpService);
    //作为 modalcomponent，在载入的时候已经确定了登录状态，事实上不用订阅下面的登录取消事件？
    if (!this.loginService.IsLoginIn) this._userPlayList = [];
    else this.init();
    // this.loginService.loginStateChanged.subscribe(x=>{
    //   if(x)this.init();
    //   else this._userPlayList=[];
    // });
  }

  ngOnInit() {}
  public get UserPlayList() {
    return this._userPlayList;

  }
  private init(){
    let userId = this.loginService.loginUser.userId;
    this.userPlayListPageInfo.initAsync(userId)
    .then(() => this._userPlayList = this.userPlayListPageInfo.data.filter(x => x.createUser.userId == userId));
  }
  public destroyModal() {
    this.modal.destroy({
      data: 'this the result data'
    });
  }
  public choosePlayListSuccess(playList: PlayList) {
    this.httpService
      .GetFromServer<emptyResult>("Playlist", "ManipulateUserPlayList", {
        add: true,
        pid: playList.id,
        mids: [this.musicId]
      })
      .toPromise()
      .then(x =>
        this.messageService.success(
          "收藏歌曲:{" + this.musicId + "}到歌单:{" + playList.name + "}成功！"
        )
      )
      .catch(_err =>
        this.messageService.error(
          "收藏歌曲:{" +
            this.musicId +
            "}到歌单:{" +
            playList.name +
            "}发生了错误！"
        )
      )
      .then(() => this.destroyModal());
  }
}
