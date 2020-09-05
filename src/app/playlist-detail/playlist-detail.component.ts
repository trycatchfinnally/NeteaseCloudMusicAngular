import {
  Component,
  OnInit,
  ElementRef,
  ViewChild} from "@angular/core";
import {
  PlayListDetail
} from "../JsonResultModel/play-list-detail";
import {
  DefaultHttpService
} from "../service/default-http-service";
import {
  ActivatedRoute,
  Router,
  NavigationEnd
} from "@angular/router";

import {
  CollectionService
} from "../service/collection.service";
import {
  Music
} from "../DominModel/music";
import {
  SelectableMusic
} from "../DominModel/SelectableMusic";
import {
  fromEvent
} from "rxjs/internal/observable/fromEvent";

import {
  debounceTime,
  distinctUntilChanged
} from "rxjs/operators";
import {
  AddtoplayService
} from "../service/addtoplay.service";
import {
  LikeListProviderService
} from "../service/like-list-provider.service";
import {
  LoggerService
} from '../service/logger.service';
import { Subscription } from 'rxjs';
import { AddToPlayServiceFactoryService } from '../service/add-to-play-service-factory.service';

@Component({
  selector: "app-playlist-detail",
  templateUrl: "./playlist-detail.component.html",
  styleUrls: ["./playlist-detail.component.css"]
})
export class PlaylistDetailComponent implements OnInit {
  private _displayMusicCollection: SelectableMusic[] = [];
  private _playlistId: number;
  private _unsubObject: Subscription;
  private eventAdded = false;
  public isLoadding = false;
  public playListDetailModel: PlayListDetail;
  public get displayMusicCollection() {
    return this._displayMusicCollection;
  }
  public set displayMusicCollection(value) {
    this._displayMusicCollection = value;
    this.addToPlayService.initAsync(value);
  }
  public searchKey: string;
  public addToPlayService: AddtoplayService;

  @ViewChild("searchInput", { static: false }) searchInput: ElementRef;
  constructor(
    private http: DefaultHttpService,
    private logger: LoggerService,
    private route: ActivatedRoute,
    private isLikeService: LikeListProviderService,
    private collectionService: CollectionService,
    private router: Router,
    private addToPlayServiceFactory: AddToPlayServiceFactoryService
  ) {
    this.addToPlayService = this.addToPlayServiceFactory.createAddToPlayService();
    this._unsubObject = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.init(this.http);
      }
    });
  }
  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.eventAttach();
  }
  ngOnInit() {}
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this._unsubObject != null) this._unsubObject.unsubscribe();
  }
  private init(http: DefaultHttpService) {
    this.isLoadding = true;
    this._playlistId = +this.route.snapshot.paramMap.get("playlistid");
    if (!isNaN(this._playlistId)) {
      this.logger.LogDebug("加载一次列表" + this._playlistId);
      http
        .GetFromServer<PlayListDetail>("Playlist", "GetPlaylistById", {
          id: this._playlistId,
        })
        .subscribe((x) => {
          x.id = this._playlistId;
          this.playListDetailModel = x;
          this.prepareForDisplay(x.musics);
          this.isLoadding = false;
        });
    }
  }
  private eventAttach() {
    if (this.eventAdded || !this.searchInput) return;
    fromEvent(this.searchInput.nativeElement, "input")
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.displayMusicCollection = [];
        if (this.searchKey == undefined || this.searchKey.length === 0) {
          this.prepareForDisplay(this.playListDetailModel.musics);
          return;
        }
        let searchResult: Music[] = [];
        this.playListDetailModel.musics.forEach(y => {
          if (y.name.indexOf(this.searchKey) != -1) searchResult.push(y);
          else if (y.album.name.indexOf(this.searchKey) != -1)
            searchResult.push(y);
          else {
            for (let index = 0; index < y.artists.length; index++) {
              let element = y.artists[index];
              if (element.name.indexOf(this.searchKey) != -1)
                searchResult.push(y);
            }
          }
        });
        this.prepareForDisplay(searchResult);
      });
    this.eventAdded = true;
  }

  topPartControlClick(index: number) {
    switch (index) {
      case 0:
        this.collectionService.collectionPlayList(this.playListDetailModel);
        break;
      case 1:
        this.router.navigate(["playdetail/comment"], {
          queryParams: {
            playListId: this._playlistId,
            playListName: this.playListDetailModel.name,
            picUrl: this.playListDetailModel.picUrl,
            userName: this.playListDetailModel.createUser.userName,
            userId: this.playListDetailModel.createUser.userId,
            commentCount: this.playListDetailModel.commentCount
          }
        });
        break;
      case 2:
        break;
    }
  }
  prepareForDisplay(musics: Music[]) {
    // this.displayMusicCollection.splice(0, this.displayMusicCollection.length);
    if (musics.length <= 0) {
      this.displayMusicCollection = [];
      return;
    }
    let tmpArray = [];

    const keys = Object.keys(musics[0]);
    musics.forEach(x => {
      let temp = new SelectableMusic();

      keys.forEach(y => (temp[y] = x[y]));
      tmpArray.push(temp);
    });
    this.isLikeService.IsLikeMusics(tmpArray);
    this.displayMusicCollection = tmpArray;
  }
}
