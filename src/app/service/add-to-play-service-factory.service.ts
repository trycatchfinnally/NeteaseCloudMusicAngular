import { Injectable } from "@angular/core";
import { AudioService } from "./audio.service";
import { LikeListProviderService } from "./like-list-provider.service";
import { LoginServiceService } from "./login-service.service";
import { LikeOrDisLikeMusicService } from "./like-or-dis-like-music.service";
import { NzNotificationService } from "ng-zorro-antd";
import { MusicUrlAvailableCheckerService } from "./music-url-available-checker.service";
import { AddtoplayService } from "./addtoplay.service";
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: "root"
})
export class AddToPlayServiceFactoryService {
  constructor(
    private audioService: AudioService,
    private likelistProvider: LikeListProviderService,
    private loginService: LoginServiceService,
    private likeMusicService: LikeOrDisLikeMusicService,
    private availableChecker: MusicUrlAvailableCheckerService,
    private nzNotificationService: NzNotificationService,
    private logger:LoggerService
  ) {}
  public createAddToPlayService() {
   this.logger.LogDebug("创建一个新的实例");
    return new AddtoplayService(
      this.audioService,
      this.likelistProvider,
      this.loginService,
      this.likeMusicService,
      this.availableChecker,
      this.nzNotificationService,
      this.logger
    );
  }
}
