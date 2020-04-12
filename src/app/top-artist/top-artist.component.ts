import { Component, OnInit } from "@angular/core";
import { KeyValue } from "@angular/common";
import { Artist } from "../DominModel/artist";
import { DefaultHttpService } from "../service/default-http-service";

import { error } from "util";

@Component({
  selector: "app-top-artist",
  templateUrl: "./top-artist.component.html",
  styleUrls: ["./top-artist.component.css"]
})
export class TopArtistComponent implements OnInit {
  private headers = ["华语", "欧美", "韩国", "日本"];
  public artistLists: KeyValue<string, Artist[]>[] = [];
  public updateDate: Date = new Date();

  constructor(private httpService: DefaultHttpService) {
    this.headers.forEach(x => this.artistLists.push({ key: x, value: [] }));
  }

  ngOnInit() {
    this.tabSelect(this.headers[0]);
  }
  public tabSelect(header: string) {
    let temp = this.artistLists.find(x => x.key == header);
    if (temp == null) throw new error();
    let type = this.headers.indexOf(header) + 1;

    if (temp.value.length == 0) {
      this.httpService
        .GetFromServer<KeyValue<Date, Artist[]>>("BillBoard", "GetTopArtist", {
          type: type
        })
        .subscribe(x => {
          this.updateDate = x.key;
          temp.value = x.value;
        });
    }
  }
}
