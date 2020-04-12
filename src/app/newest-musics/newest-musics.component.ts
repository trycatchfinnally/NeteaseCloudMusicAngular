import { Component, OnInit } from "@angular/core";
import { AddtoplayService } from "../service/addtoplay.service";
import { DefaultHttpService } from "../service/default-http-service";
import { Music } from "../DominModel/music";
import { topAlbumsPageInfo } from "../DominModel/pageInfo";
import { AddToPlayServiceFactoryService } from "../service/add-to-play-service-factory.service";

@Component({
  selector: "app-newest-musics",
  templateUrl: "./newest-musics.component.html",
  styleUrls: ["./newest-musics.component.css"]
})
export class NewestMusicsComponent implements OnInit {
  public isNewMusicsVisiable = true;
  public selectedCatIndex = 0;
  public topAlbums: topAlbumsPageInfo;
  public addToPlayService: AddtoplayService;
  constructor(
    private addToPlayServiceFactory: AddToPlayServiceFactoryService,
    private httpService: DefaultHttpService
  ) {
    this.addToPlayService = this.addToPlayServiceFactory.createAddToPlayService();
    this.topAlbums = new topAlbumsPageInfo(httpService);
  }

  ngOnInit() {
    this.catNameClick(0);
  }
  catNameClick(index: number) {
    this.selectedCatIndex = index;
    this.httpService
      .GetFromServer<Music[]>("FindMusic", "TopMusics", { type: index + 1 })
      .subscribe(x => this.addToPlayService.initAsync(x));
  }
  newMusicsOrDiskClick(isNewMusic: boolean) {
    this.isNewMusicsVisiable = isNewMusic;
    if (!isNewMusic && this.topAlbums.data.length == 0) {
      this.topAlbums.init();
    }
  }
}
