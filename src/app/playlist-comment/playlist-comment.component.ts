import { Component, OnInit } from '@angular/core';
import { PlayListDetail } from '../JsonResultModel/play-list-detail';
import { ActivatedRoute, Router } from '@angular/router';
 
@Component({
  selector: 'app-playlist-comment',
  templateUrl: './playlist-comment.component.html',
  styleUrls: ['./playlist-comment.component.css']
})
export class PlaylistCommentComponent implements OnInit {
  private _playListId:number;
  public playListName:string;
 public picUrl:string;
 public userName:string;
 public userId:number;
 public commentCount:number;
 public get commentThreadId(){
   return "A_PL_0_"+this._playListId;
 }
  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
     
    let temp=this.route.snapshot;
    this._playListId= +temp.queryParams["playListId"];
    this.picUrl=temp.queryParams["picUrl"];
    this.userId=+temp.queryParams["userId"];
    this.userName=temp.queryParams["userName"];
    this.commentCount=temp.queryParams["commentCount"];
    this.playListName=temp.queryParams["playListName"];
    if(!this.checkAccess())
  this.router.navigate(["notfound"]);
  }
private checkAccess(){
  if(isNaN(this.userId))return false;
  if(isNaN(this._playListId))return false;
  if(isNaN(this.commentCount))return false;
  if(this.userName==null||this.userName.length==0)return false;
  if(this.playListName==null||this.playListName.length==0)return false;
  if(this.userName==null||this.userName.length==0)return false;
  return true;
}
}
