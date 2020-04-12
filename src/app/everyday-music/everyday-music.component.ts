import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  Music
} from '../DominModel/music';
import {
  DefaultHttpService
} from '../service/default-http-service';
import {
  SelectableMusic
} from '../DominModel/SelectableMusic';
import {
  AudioService
} from '../service/audio.service';
import { playTrackType } from '../Enums/playTrackType';
import { AddtoplayService } from '../service/addtoplay.service';
import { LikeListProviderService } from '../service/like-list-provider.service';
import { LoginServiceService } from '../service/login-service.service';
import { LikeOrDisLikeMusicService } from '../service/like-or-dis-like-music.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { MusicUrlAvailableCheckerService } from '../service/music-url-available-checker.service';
import { AddToPlayServiceFactoryService } from '../service/add-to-play-service-factory.service';
import { LoggerService } from '../service/logger.service';

@Component({
  selector: "app-everyday-music",
  templateUrl: "./everyday-music.component.html",
  styleUrls: ["./everyday-music.component.css"]
})
export class EverydayMusicComponent implements OnInit {
  // everydayMusics: SelectableMusic[] = [];
  // isSelectMode = false;
  public addToPlay: AddtoplayService;
  public date = new Date().getDate();

  constructor(
    private httpService: DefaultHttpService,
    private logger:LoggerService,
    private addToPlayServiceFactory: AddToPlayServiceFactoryService
  ) {
    this.addToPlay = this.addToPlayServiceFactory.createAddToPlayService();
  }

  ngOnInit() {
    this.httpService
      .GetFromServer<SelectableMusic[]>(
        "FindMusic",
        "GetEveryDayMusicRecommend",
        []
      )
      .subscribe(
        x => {
          this.addToPlay.initAsync(x);
          this.logger.LogInfo("获取每日歌曲成功！");
        },
        e => this.logger.LogDebug("err" + e)
      );
  }
}
