import { Component, OnInit } from "@angular/core";
import { AudioService } from "../service/audio.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { Mv } from "../DominModel/mv";
import { DefaultHttpService } from "../service/default-http-service";

@Component({
  selector: "app-mv",
  templateUrl: "./mv.component.html",
  styleUrls: ["./mv.component.css"]
})
export class MvComponent implements OnInit {
  private _resumeRequired = false;
  private _mvDetail: Mv;
  private _resolutionRatio: string;
  private _navigationSubscription: any;
  private mvDomElement: any;
  private controlPart: any;
  public simiMvs: Mv[] = [];
  public get mvDetail() {
    return this._mvDetail;
  }
  public set mvDetail(value) {
    this._mvDetail = value;

    // this.pause();
  }
  public get paused() {
    if (this.mvDomElement == null) return true;
    return this.mvDomElement.paused;
  }
  public set paused(value) {
    if (value) this.pause();
    else {
      if (this.mvDomElement.src != null) this.mvDomElement.play();
    }
  }
  public get volumn(): number {
    if (this.mvDomElement == null) return 100;
    return this.mvDomElement.volume * 100;
  }
  public set volumn(value) {
    if (this.mvDomElement == null) return;
    this.mvDomElement.volume = value / 100;
  }
  public get timespanInfo(): string {
    if (this.mvDomElement == null) return "00:00:00/00:00:00";
    let part1 = this.currentTimeFormatter(this.mvDomElement.currentTime);

    return part1 + "/" + this.mvDetail.duration;
  }
  public get currentTime() {
    if (this.mvDomElement == null) return 0;
    return this.mvDomElement.currentTime;
  }
  public set currentTime(value) {
    if (this.mvDomElement == null) return;
    this.mvDomElement.currentTime = value;
  }
  public get muted(): boolean {
    if (this.mvDomElement == null) return true;
    return this.mvDomElement.muted;
  }
  public set muted(value) {
    if (this.mvDomElement == null) return;
    this.mvDomElement.muted = value;
  }
  public get duration() {
    if (this.mvDetail == null) return 0;

    return this.splitTime(this.mvDetail.duration);
  }
  public get resolutionRatio() {
    if (this.mvDetail == null) return "";
    let obj = this.mvDetail.url;

    if (this._resolutionRatio != null && obj[this._resolutionRatio] != null)
      return this._resolutionRatio;

    this._resolutionRatio = Object.keys(obj).find(x => obj[x] != null);
    return this._resolutionRatio;
  }
  public set resolutionRatio(value) {
    this._resolutionRatio = value;
    if (this.mvDetail != null) this.play();
  }
  constructor(
    private audioService: AudioService,
    private route: ActivatedRoute,
    private router: Router,
    private httpService: DefaultHttpService
  ) {
    this._navigationSubscription = router.events.subscribe(x => {
      if (x instanceof NavigationEnd) {
        this.init();
        this._resumeRequired = !this.audioService.paused;
        if (this._resumeRequired) this.audioService.paused = true;
      }
    });
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.controlPart != null) this.controlPart.hidden = false;
    if (this._resumeRequired) this.audioService.paused = false;
    if (this._navigationSubscription != null)
      this._navigationSubscription.unsubscribe();
  }
  private init() {
    let id = +this.route.snapshot.paramMap.get("mvid");
    if (isNaN(id)) return;
    this.httpService
      .GetFromServer<Mv>("Mv", "GetMvById", {
        id: id
      })
      .subscribe(x => {
        this.mvDetail = x;
        this.play();
      });
    this.httpService
      .GetFromServer<Mv[]>("Mv", "GetSimiMv", {
        id: +id
      })
      .subscribe(x => (this.simiMvs = x));
    this.controlPart = document.getElementById("controlPart");
    if (this.controlPart != null) this.controlPart.hidden = true;
  }
  private splitTime(str: string) {
    let temps = str.split(":");
    let hh = +temps[0];
    let mm = +temps[1];
    let ss = +temps[2];
    return hh * 3600 + mm * 60 + ss;
  }
  private checkAcess() {
    if (this.mvDomElement == null)
      this.mvDomElement = document.getElementById("mvDomElement");
    if (this.mvDomElement == null) throw new Error("播放组件未加载");
  }
  private play() {
    this.checkAcess();
    if (this.mvDetail == null) return;
    this.mvDomElement.src = this.mvDetail.url[this.resolutionRatio];

    this.mvDomElement.play();
  }
  private pause() {
    if (this.mvDomElement != null) this.mvDomElement.pause();
  }
  public currentTimeFormatter(value: number): string {
    let hh = Math.floor(value / 3600);
    let mm = Math.floor((value - hh * 3600) / 60);
    let ss = Math.ceil(value - hh * 3600 - mm * 60);
    return `${hh.toString().padStart(2, "0")}:${mm
      .toString()
      .padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  }

  navBackClick() {
    console.log(this.router);
  }
}
