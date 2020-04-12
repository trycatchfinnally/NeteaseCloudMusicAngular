import {
  Component,
  OnInit,
 
} from "@angular/core";
import { playListCategory } from "../DominModel/playListCategory";
import { DefaultHttpService } from "../service/default-http-service";
 

import { topCategoryPlaylistPageInfo } from "../DominModel/pageInfo";
import { selectCategoryEventArgs } from "../DominModel/selectCategoryEventArgs";

@Component({
  selector: "app-play-list",
  templateUrl: "./play-list.component.html",

  styleUrls: ["./play-list.component.css"],
})
export class PlayListComponent implements OnInit {
  private _checkedCategory: playListCategory;
  
  public hotPlayListCategories: playListCategory[] = [];
  public topCategoryPlaylists: topCategoryPlaylistPageInfo;
  public get checkedCategort() {
    return this._checkedCategory;
  }
  public set checkedCategort(value) {
    this._checkedCategory = value;
    this.topCategoryPlaylists.init(value.name);
  }
  
   
  constructor(private httpservice: DefaultHttpService) {
    this.topCategoryPlaylists = new topCategoryPlaylistPageInfo(httpservice);
  }

  ngOnInit() {
   this.httpservice
     .GetFromServer<playListCategory[]>(
       "FindMusic",
       "GetHotPlayListCategories",
       {}
     )
      .subscribe((x) => (this.hotPlayListCategories = x));
     this.httpservice
       .GetFromServer<playListCategory[]>(
         "FindMusic",
         "GetPlayListCategories",
         {}
       )
       .subscribe((x) => this.checkedCategort=x.find(x=>x.categoryTypeName==""));
  }
  public catSelectChange($event: selectCategoryEventArgs) {
    if ($event.addplayListCategory != null)
      this.checkedCategort = $event.addplayListCategory;
  }
}
