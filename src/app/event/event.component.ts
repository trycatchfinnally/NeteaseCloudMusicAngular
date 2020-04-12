import { Component, OnInit } from "@angular/core";
import { eventResult } from "../DominModel/event";
import { LoggerService } from "../service/logger.service";
import { DefaultHttpService } from "../service/default-http-service";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.css"]
})
export class EventComponent implements OnInit {
  private _pageSize = 30;
  private _eventResult: eventResult;
  private _maxEventSize = 120;
  public isLoadding = false;

  public get displayEvents() {
    if (this._eventResult == null) return [];
    return this._eventResult.aEvents;
  }

  public get more() {
    if (this._eventResult == null) return false;
    return this._eventResult.more;
  }

  constructor(
    private logger: LoggerService,
    private httpService: DefaultHttpService
  ) {}

  ngOnInit() {
    this.isLoadding = true;
    this.httpService
      .GetFromServer<eventResult>("Event", "EventList", {
        pagesize: this._pageSize
      })
      .subscribe(x => {
        this._eventResult = x;

        this.isLoadding = false;
      });
  }

  public fetchNextPage() {
    this.isLoadding = true;
    this.httpService
      .GetFromServer<eventResult>("Event", "EventList", {
        pagesize: this._pageSize,
        lasttime: this._eventResult.lastTime
      })
      .subscribe(x => {
        this._eventResult.lastTime = x.lastTime;
        this._eventResult.code = x.code;
        this._eventResult.more = x.more;
        this._eventResult.aEvents = this._eventResult.aEvents.concat(x.aEvents);
        if (this._eventResult.aEvents.length > this._maxEventSize) {
          let length = this._eventResult.aEvents.length;
          while (length > this._maxEventSize) {
            this._eventResult.aEvents.shift();
            length--;
          }
        }
        this.logger.LogDebug(
          "当前显示的事件数量为" + this._eventResult.aEvents.length
        );
        this.isLoadding = false;
      });
  }
}
