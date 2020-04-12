import { Component, OnInit } from "@angular/core";
import { Artist } from "../DominModel/artist";
import { DefaultHttpService } from "../service/default-http-service";
import { AudioService } from "../service/audio.service";
import { CollectionService } from "../service/collection.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Music } from "../DominModel/music";
import { SelectableMusic } from "../DominModel/SelectableMusic";
import { KeyValue } from "@angular/common";

import { artistAlbumPageInfo, artistMvPageInfo } from "../DominModel/pageInfo";
import { AddtoplayService } from "../service/addtoplay.service";
import { LikeListProviderService } from "../service/like-list-provider.service";
import { LoginServiceService } from "../service/login-service.service";
import { LikeOrDisLikeMusicService } from "../service/like-or-dis-like-music.service";
import { NzNotificationService } from "ng-zorro-antd";
import { MusicUrlAvailableCheckerService } from "../service/music-url-available-checker.service";
import { AddToPlayServiceFactoryService } from '../service/add-to-play-service-factory.service';

@Component({
  selector: "app-artist",
  templateUrl: "./artist.component.html",
  styleUrls: ["./artist.component.css"]
})
export class ArtistComponent implements OnInit {
  private _artistDetail: Artist;

  private navigationSubscription;
  public get artistDetail() {
    return this._artistDetail;
  }
  public set artistDetail(value) {
    this._artistDetail = value;
    this.isLoadding = false;
    this.addToPlayService.initAsync(value.hotMusics);
  }
  public artistAlbums: artistAlbumPageInfo;
  public artistIntroduction: KeyValue<string, string>[] = [];
  public artistMvs: artistMvPageInfo;
  public simiArtists: Artist[] = [];
  public isSelectMode = false;
  public addToPlayService: AddtoplayService;
  public isLoadding = false;
  constructor(
    private http: DefaultHttpService,
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private addToPlayServiceFactory:AddToPlayServiceFactoryService
  ) {
    this.addToPlayService = addToPlayServiceFactory.createAddToPlayService();
      
      this.navigationSubscription = this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.init(http);
        }
      }
    );
  }
  init(http: DefaultHttpService) {
    this.artistAlbums = new artistAlbumPageInfo(http);
    this.artistMvs = new artistMvPageInfo(http);
    let id = +this.route.snapshot.paramMap.get("artistid");
    if (isNaN(id)) return;
    this.isLoadding = true;
    this.http
      .GetFromServer<Artist>("Artist", "GetArtistDetailById", {
        id: id
      })
      .subscribe(x => {
        x.id = id;
        this.artistDetail = x;
      });
    this.artistAlbums.init(id);
    this.artistMvs.init(id);
    this.http
      .GetFromServer<KeyValue<string, string>[]>(
        "Artist",
        "GetArtistIntroduction",
        {
          id: id
        }
      )
      .subscribe(x => {
        this.artistIntroduction = x;
      });
    this.http
      .GetFromServer<Artist[]>("Artist", "GetSimiArtists", {
        id: id
      })
      .subscribe(x => (this.simiArtists = x));
  }
  ngOnInit() {}
  ngOnDestroy() {
    if (this.navigationSubscription != null) {
      this.navigationSubscription.unsubscribe();
    }
  }
  collectionClick() {
    if (this.artistDetail != null)
      this.collectionService.collectionArtist(this.artistDetail);
  }
}
