import {
  Injectable
} from '@angular/core';
import {
  NzMessageService, NzModalService
} from 'ng-zorro-antd';
import { LoginServiceService } from './login-service.service';
import { promise } from 'protractor';
import { PlayList } from '../DominModel/play-list';
import { DefaultHttpService } from './default-http-service';
import { PlayListDetail } from '../JsonResultModel/play-list-detail';
import { Artist } from '../DominModel/artist';
import { Album } from '../DominModel/album';
import { userPlayListPageInfo, loginUserPlayListPageInfo } from '../DominModel/pageInfo';
import { NzCollectMusicModalCustomComponent } from '../nz-collect-music-modal-custom/nz-collect-music-modal-custom.component';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private messageService: NzMessageService,private loginService:LoginServiceService,
    private httpService:DefaultHttpService,private modalService: NzModalService) {}
 
//表示在收藏之前的登录验证
  private async  checkAccess(){
    if(this.loginService.IsLoginIn)
    return true;
   await this.loginService.LoginRequestedAsync();
  return this.loginService.IsLoginIn;
  }
  
  //收藏音乐
  public async collectionMusic(musicId: number) {
  if(! await this.checkAccess()){this.messageService.error("你还没有登录额，不能收藏歌曲");return false;}
  this.modalService.create({
    nzTitle:"添加到歌单",
    nzContent:NzCollectMusicModalCustomComponent,
    nzOnOk:()=>console.log("添加ok"),
    nzFooter:null,
    nzComponentParams:{musicId:musicId},
    nzClosable:true
  });
   
    return true;
  }
  //收藏播放列表
  public async collectionPlayList(playList: PlayListDetail) {
    if(! await this.checkAccess()){this.messageService.error("你还没有登录额，不能收藏歌单");return false;}
    if(playList.createUser!=null&&this.loginService.loginUser.userId==playList.createUser.userId){
      this.messageService.error("不能收藏自己创建的歌单额！");return false;
    }
    let success=true;
    await this.httpService.GetFromServer<string>("User","SubscribePlaylistOrNot",{id:playList.id,subscribe:true})
    .toPromise().then(_x=>this.messageService.success("收藏歌单:{" + playList.name+"}成功！"))
    .catch( _err=>{this.messageService.error("收藏歌单：{"+playList.name+"发生了错误！}");success=false;});
    return success;
  }
  //收藏歌手
  public async  collectionArtist(artist: Artist) {
    if(! await this.checkAccess()){this.messageService.error("你还没有登录额，不能收藏歌手");return false;}
    let success=true;
    await this.httpService.GetFromServer<string>("User","SubscribeArtistOrNot",{id:artist.id,subscribe:true})
    .toPromise().then(_x=>this.messageService.success("收藏歌手:{" + artist.name+"}成功！"))
    .catch( _err=>{this.messageService.error("收藏歌手：{"+artist.name+"}发生了错误！");success=false;});
    return success;
  }
  //收藏专辑
  public async collectionAlbum(album:Album){
    if(! await this.checkAccess()){this.messageService.error("你还没有登录额，不能收藏专辑");return false;}
    let success=true;
    await this.httpService.GetFromServer<string>("User","SubscribeAlbumOrNot",{id:album.id,subscribe:true})
    .toPromise().then(_x=>this.messageService.success("收藏专辑:{" + album.name+"}成功！"))
    .catch( _err=>{this.messageService.error("收藏专辑：{"+album.name+"}发生了错误！");success=false;});
    return success;
  }
}
