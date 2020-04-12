import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { playListCategory } from "../DominModel/playListCategory";
import { selectCategoryEventArgs } from "../DominModel/selectCategoryEventArgs";
import { LoggerService } from "../service/logger.service";
import { DefaultHttpService } from "../service/default-http-service";
import { KeyValue } from "@angular/common";

@Component({
  selector: "app-playlistcategorys",
  templateUrl: "./playlistcategorys.component.html",
  styleUrls: ["./playlistcategorys.component.css"],
})
export class PlaylistcategorysComponent implements OnInit {
  @Input() multliSelect = false;
  @Output() catSelectChange = new EventEmitter<selectCategoryEventArgs>();
  private _allPlayListCategories: playListCategory[] = [];
  private _displayListCategories: KeyValue<String, playListCategory[]>[] = [];
  public selectplayListCategory: playListCategory[] = [];

  public get displayListCategories() {
    return this._displayListCategories;
  }
  private get allPlayListCategories() {
    return this._allPlayListCategories;
  }
  private set allPlayListCategories(value) {
    value.forEach((x) => {
      let findTemp = this.displayListCategories.find(
        (y) => y.key == x.categoryTypeName
      );
      if (findTemp == null)
        this.displayListCategories.push({
          key: x.categoryTypeName,
          value: [x],
        });
      else findTemp.value.push(x);
    });
    this._allPlayListCategories = value;
  }
  constructor(
    private logger: LoggerService,
    private httpService: DefaultHttpService
  ) {}

  ngOnInit() {
    this.httpService
      .GetFromServer<playListCategory[]>(
        "FindMusic",
        "GetPlayListCategories",
        {}
      )
      .subscribe((x) => (this.allPlayListCategories = x));
  }
  public cateClick(cat: playListCategory) {
    let result = new selectCategoryEventArgs();

    if (this.multliSelect) {
      let temp = this.selectplayListCategory.findIndex((x) => x == cat);
      if (temp != -1) {
        result.removeplayListCategory = this.selectplayListCategory[temp];
        this.selectplayListCategory.splice(temp, 1);
      } else {
        result.addplayListCategory = cat;
        this.selectplayListCategory.push(cat);
      }
    } else {
      if (this.selectplayListCategory.length == 0) {
        this.selectplayListCategory.push(cat);
        result.addplayListCategory = cat;
      } else if (this.selectplayListCategory[0] == cat) {
        this.selectplayListCategory = [];
        result.removeplayListCategory = cat;
      } else {
        this.selectplayListCategory = []; //清除上次的记录
        this.selectplayListCategory.push(cat);
        result.addplayListCategory = cat;
      }
    }
    result.selectedCategorys = this.selectplayListCategory;
    this.logger.LogDebug(result);
    this.catSelectChange.emit(result);
  }
  public checkedStyle(cat: playListCategory) {
    return (
      this.selectplayListCategory.findIndex((x) => x.name == cat.name) != -1
    );
  }
}
