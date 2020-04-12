import { Component, OnInit } from "@angular/core";
import { Album } from "../DominModel/album";
import { DefaultHttpService } from "../service/default-http-service";
import { ActivatedRoute } from "@angular/router";
import { CollectionService } from "../service/collection.service";
import { AudioService } from "../service/audio.service";
import { NzNotificationService } from "ng-zorro-antd";
import { MusicUrlAvailableCheckerService } from "../service/music-url-available-checker.service";
import { LoginServiceService } from "../service/login-service.service";
import { LikeListProviderService } from "../service/like-list-provider.service";
import { LikeOrDisLikeMusicService } from "../service/like-or-dis-like-music.service";
import { AddtoplayService } from "../service/addtoplay.service";
import { Music } from "../DominModel/music";
import { playTrackType } from "../Enums/playTrackType";
import { AddToPlayServiceFactoryService } from "../service/add-to-play-service-factory.service";

@Component({
  selector: "app-album",
  templateUrl: "./album.component.html",
  styleUrls: ["./album.component.css"]
})
export class AlbumComponent implements OnInit {
  private _albumDetail: Album;
  public get albumDetail() {
    return this._albumDetail;
  }
  public set albumDetail(value) {
    this._albumDetail = value;
    this.addToPlayService.initAsync(value.musics);
  }

  public addToPlayService: AddtoplayService;
  constructor(
    private http: DefaultHttpService,
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private addtoPlayServiceFactory: AddToPlayServiceFactoryService
  ) {
    this.addToPlayService = this.addtoPlayServiceFactory.createAddToPlayService();
  }

  ngOnInit() {
    let id = 0;
    this.route.paramMap.subscribe(x => {
      if (x.has("albumid")) id = +x.get("albumid");
    });

    if (id > 0)
      this.http
        .GetFromServer<Album>("Album", "GetAlbumDetailById", {
          id: id
        })
        .subscribe(x => (this.albumDetail = x));
  }
  public collectionClick() {
    this.collectionService.collectionAlbum(this.albumDetail);
  }
}
