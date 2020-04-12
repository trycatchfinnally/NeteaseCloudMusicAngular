import { Component, OnInit } from "@angular/core";
import { DefaultHttpService } from "../service/default-http-service";
import { PersonalityRecommend } from "../JsonResultModel/personality-recommend";
import { PlayList } from "../DominModel/play-list";
import { PrivateContent } from "../DominModel/private-content";
import { Mv } from "../DominModel/mv";
import { Router } from "@angular/router";
import { Radio } from "../DominModel/radio";
import { Music } from "../DominModel/music";
import { AudioService } from "../service/audio.service";
import { Banner } from "../DominModel/banner";
import { bannerType } from "../Enums/bannerType";
import { error } from "util";
import { playTrackType } from "../Enums/playTrackType";
import { LoggerService } from "../service/logger.service";
import { NzIconService } from "ng-zorro-antd";
import { LoginServiceService } from "../service/login-service.service";
import { PersonalFMService } from '../service/personal-fm.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  public personalityRecommend: PersonalityRecommend;
  public today: number;

  constructor(
    private httprequist: DefaultHttpService,
    private router: Router,
    private logger: LoggerService,
    private iconService: NzIconService,
    private audioService: AudioService,
    private personalFMService: PersonalFMService
  ) {}

  ngOnInit() {
    this.iconService.fetchFromIconfont({
      scriptUrl: "https://at.alicdn.com/t/font_1368309_ainxci6xwb.js"
    });
    this.httprequist
      .GetFromServer<PersonalityRecommend>(
        "FindMusic",
        "PersonalityRecommend",
        {
          limit: 20,
          offset: 0,
          total: 3
        }
      )
      .subscribe(data => this.Refresh(data));
    this.today = new Date().getDate();
  }
  private Refresh(data: PersonalityRecommend) {
    this.personalityRecommend = data;
  }
  public clickPlayList(playlist: PlayList) {
    this.router.navigate(["/playlistdetail", playlist.id]);
  }
  public newMusicListItemClick(music: Music) {
    this.audioService.play(music);
  }
  public clickPrivateContent(iprivate: PrivateContent) {
    console.log(iprivate);
    let url = iprivate.realUrl;
    if (url) window.open(url, "_blank");
  }
  public clickMv(ipmv: Mv) {
    let mvId = ipmv.id;
    if (mvId > 0) this.router.navigate(["/mv", mvId]);
  }
  public anchorRadioClick(anchorRadio: Radio) {
    this.logger.LogDebug(anchorRadio);
    // this.audioService.play(anchorRadio, playTrackType.radio);
    
  }

  public async personalFMClick() {
    this.logger.LogDebug("点击了私人fm");
    if (this.audioService.CurrentPlayTrackType == playTrackType.Fm) return;
    await this.personalFMService.startAsync();
    this.router.navigate(["/playdetail"]);
  }
  public bannerClick(banner: Banner) {
    if (banner.url != null) {
      window.open(banner.url, "_blank");
      return;
    }
    switch (banner.bannerType) {
      case bannerType.playList:
        this.router.navigate(["/playlistdetail", banner.targetId]);
        break;
      case bannerType.music:
        this.httprequist
          .GetFromServer<Music>("Music", "GetMusicDetailById", {
            id: banner.targetId
          })
          .subscribe(x => this.audioService.play(x, playTrackType.basicMusic));
        break;
      default:
        throw new error("还未对应的部分");
    }
  }
}
