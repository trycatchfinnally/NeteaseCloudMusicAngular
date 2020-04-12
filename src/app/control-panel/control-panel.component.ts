import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from "@angular/core";
import { AudioService } from "../service/audio.service";
import { Music } from "../DominModel/music";
import { NzIconService } from "ng-zorro-antd";
import { CollectionService } from "../service/collection.service";
import { Router } from "@angular/router";
import { LoggerService } from "../service/logger.service";
import { playTrackType } from "../Enums/playTrackType";
import { PersonalFMService } from "../service/personal-fm.service";

const INTERVAL = 500;
@Component({
  selector: "app-control-panel",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./control-panel.component.html",
  styleUrls: ["./control-panel.component.css"]
})
export class ControlPanelComponent implements OnInit {
  constructor(
    private router: Router,
    private logger: LoggerService,
    public audioService: AudioService,
    private change: ChangeDetectorRef,
    private iconService: NzIconService,
    public collectionService: CollectionService,
    private personalFmService: PersonalFMService
  ) {
    this.iconService.fetchFromIconfont({
      scriptUrl: "https://at.alicdn.com/t/font_1368309_ainxci6xwb.js"
    });
  }

  ngOnInit() {
    this.audioService.initComponent(document.getElementById("mainPlayer"));
    this.init();
  }

  public get timespanInfo(): string {
    let part1 = this.currentTimeFormatter(this.audioService.currentTime);
    let temp = this.audioService.duration;
    if (isNaN(temp)) {
      temp = 0;
    }
    let part2 = this.currentTimeFormatter(temp);
    return part1 + "/" + part2;
  }
  public get musicCollection() {
    let temp = this.audioService.displayTrackCollection;

    if (temp.length <= 0) {
      return [];
    }
    let tempChild = temp[0] as Music;
    if (tempChild != null) return temp.map(x => x as Music);
    return [];
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  private async init() {
    while (true) {
      this.change.detectChanges();
      if (this.audioService.ended && !this.audioService.srcLoadding) {
        try {
          if (this.audioService.CurrentPlayTrackType != playTrackType.Fm)
            this.audioService.next();
          else await this.personalFmService.nextRequestAsync();
        } catch (error) {
          this.logger.LogError(error);
          continue;
        }
      }
      await this.delay(INTERVAL);
    }
  }
  public playListItemClick(track: Music) {
    if (track.id != this.audioService.currentTrack.id)
      this.audioService.play(track);
  }
  //将以s计的时间转换成00:00:00形式
  public currentTimeFormatter(value: number): string {
    let hh = Math.floor(value / 3600);
    let mm = Math.floor((value - hh * 3600) / 60);
    let ss = Math.ceil(value - hh * 3600 - mm * 60);
    return `${hh.toString().padStart(2, "0")}:${mm
      .toString()
      .padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  }
  public clearAllClick() {
    this.audioService.stop();
    this.audioService.displayTrackCollection.splice(
      0,
      this.audioService.displayTrackCollection.length
    );
  }
  public musicImgClick() {
    if (this.audioService.currentTrack) {
      this.logger.LogDebug("导航到播放面板");
      this.router.navigate(["/playdetail"]);
    }
  }
  public async nextClick() {
    if (this.audioService.CurrentPlayTrackType != playTrackType.Fm)
      this.audioService.next();
    else await this.personalFmService.nextRequestAsync();
  }
}
