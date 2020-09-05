import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { LoginServiceService } from "../service/login-service.service";
import { DefaultHttpService } from "../service/default-http-service";

import { Router } from "@angular/router";
import { fromEvent, of } from "rxjs";
import { Album } from "../DominModel/album";
import { Mv } from "../DominModel/mv";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Music } from "../DominModel/music";
import { PlayList } from "../DominModel/play-list";
import { RegisterService } from '../service/register.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  @ViewChild("inputKeyWord", { static: true }) inputKeyWord: ElementRef;
  private inputKeyWordObservable;
  // private _isLoginRequest =false;
  // private _loginInUser:User=null;
  public searchKey: string;

  // public isLoginOkLoading = false;
  // public passwordVisible = false;
  // public loginErrMsg: string;
  // public validateForm: FormGroup;
  public searchKeyWordSuggest: string[] = [];
  //   public get  loginInUser(){return this._loginInUser;}
  // public set loginInUser(value:User){this._loginInUser=value;this.logService.loginUser=value;}

  constructor(
    public logService: LoginServiceService,
    public http: DefaultHttpService,
    private httpservice: DefaultHttpService,
    private router: Router,
    private registerService:RegisterService
  ) {}

  ngOnInit() {
    this.subScribeEvent();
  }
  private subScribeEvent() {
    this.inputKeyWordObservable = fromEvent(
      this.inputKeyWord.nativeElement,
      "input"
    ).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(x => {
        this.searchKeyWordSuggest.splice(0, this.searchKeyWordSuggest.length);
        if (this.searchKey == undefined || this.searchKey.length === 0) {
          return of("");
        }
        return this.httpservice.GetFromServer<string>("search", "suggest", {
          keyWord: this.searchKey
        });
      })
    );
    this.inputKeyWordObservable.subscribe(y => {
      if (y == "") return;
      let albums: Album[] = y["albums"];
      let mVs: Mv[] = y["mVs"];
      let musics: Music[] = y["musics"];
      let playLists: PlayList[] = y["playLists"];
      let temp: string[] = [];
      if (albums) {
        albums.forEach(al => {
          if (al.name && al.name.indexOf(this.searchKey) > -1)
            temp.push(al.name);
          else if (
            al.artist &&
            al.artist.name &&
            al.artist.name.indexOf(this.searchKey) > -1
          )
            temp.push(al.artist.name);
        });
      }
      if (mVs) {
        mVs.forEach(mv => {
          if (mv.name && mv.name.indexOf(this.searchKey) > -1)
            temp.push(mv.name);
          else if (
            mv.artists &&
            mv.artists[0].name.indexOf(this.searchKey) > -1
          )
            temp.push(mv.artists[0].name);
        });
      }
      if (musics) {
        musics.forEach(music => {
          if (music.name && music.name.indexOf(this.searchKey) > -1)
            temp.push(music.name);
          else if (
            music.artists &&
            music.artists[0].name.indexOf(this.searchKey) > -1
          )
            temp.push(music.artists[0].name);
        });
      }
      if (playLists) {
        playLists.forEach(playList => {
          if (playList.name && playList.name.indexOf(this.searchKey) > -1)
            temp.push(playList.name);
        });
      }
      this.searchKeyWordSuggest = this.distinctArray(temp).sort();
    });
  }
  private distinctArray(arr: string[]) {
    let left: string[] = [];
    let result: string[] = [];

    for (let i = 0; i < arr.length; i++) {
      let temp = arr[i];
      if (left.indexOf(temp) < 0) {
        result.push(temp);
      }

      left.push(temp);
    }
    left.splice(0, left.length);
    return result;
  }
 public headerSearchClick() {
    this.searchKeyWordSuggest = [];

    if (this.searchKey && this.searchKey.trim().length > 0)
      this.router.navigate([
        "/search",
        {
          keyword: this.searchKey
        }
      ]);
    else this.router.navigate(["/search"]);
    this.searchKey = "";
  }
 public selectInputSuggest(selectKey: string) {
    this.searchKey = selectKey;
    this.headerSearchClick();
  }
 public login() {
    this.logService.LoginRequestedAsync();
  }
 public  register(){
   this.registerService.RegisterRequestAsync();
  }
}
