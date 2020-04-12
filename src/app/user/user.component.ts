import { Component, OnInit } from '@angular/core';
import { User } from '../DominModel/user';
import { ActivatedRoute } from '@angular/router';
import { DefaultHttpService } from '../service/default-http-service';
import { userPlayListPageInfo } from '../DominModel/pageInfo';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private _id=0;
  public userDetail:User;
  public userPlaylists:userPlayListPageInfo;
  public get userCreatePlaylists(){
    if(this.userPlaylists==null||isNaN(this._id))return [];
    return this.userPlaylists.data.filter(x=>x.createUser.userId==this._id);
  }
  public get userCollectionPlaylists(){
    if(this.userPlaylists==null||isNaN(this._id))return [];
    return this.userPlaylists.data.filter(x=>x.createUser.userId!=this._id);

  }
  constructor(private http: DefaultHttpService, private route: ActivatedRoute) { this.userPlaylists=new userPlayListPageInfo(http);}

  ngOnInit() {
    let id = '';
    this.route.paramMap.subscribe(x => {
      if (x.has("userid"))
        id = x.get('userid');
    });
    this._id=+id;
    this.http.GetFromServer<User>('User','GetUserById',{id:this._id}).subscribe(x=>this.userDetail=x);
    this.userPlaylists.init(this._id);
  }
  topPartControlClick(type:number){
     switch (type)
     {
       case 0:break;
       case 1:break;
       case 2:break;
       case 3:break;

     } 
  }

}
