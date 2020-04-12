import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoggerService } from "../service/logger.service";
import { PlayListDetail } from "../JsonResultModel/play-list-detail";
import { DefaultHttpService } from "../service/default-http-service";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { selectCategoryEventArgs } from "../DominModel/selectCategoryEventArgs";
import { playListCategory } from "../DominModel/playListCategory";
import { emptyResult } from "../DominModel/emptyResult";

@Component({
  selector: "app-update-playlist",
  templateUrl: "./update-playlist.component.html",
  styleUrls: ["./update-playlist.component.css"],
})
export class UpdatePlaylistComponent implements OnInit {
  private _id = 0;
  private _cacheSelectedCat: playListCategory[] = [];
  public selectCatVisiable = false;
  public submitting = false;
  public validateForm: FormGroup;
  public playListDetail: PlayListDetail;
  constructor(
    private fb: FormBuilder,
    private logger: LoggerService,
    private httpService: DefaultHttpService,
    private route: ActivatedRoute,
    private nzMessageService: NzMessageService
  ) {}

  ngOnInit() {
    this.Init();
  }
  private Init() {
    this._id = +this.route.snapshot.paramMap.get("playlistid");
    if (isNaN(this._id)) {
      this.nzMessageService.error("导航参数错误！"); //后端会返回404
    }
    this.httpService
      .GetFromServer<PlayListDetail>("Playlist", "GetPlaylistById", {
        id: this._id,
      })
      .toPromise()
      .then((x) => (this.playListDetail = x))
      .then(() => {
        this.validateForm = this.fb.group({
          name: [
            this.playListDetail.name,
            [Validators.required, Validators.pattern("[^\\s]{1,20}")],
          ],
          desc: [this.playListDetail.description],
        });
      })
      .catch(() => this.nzMessageService.error("网络连接失败!"));
  }
  public submit() {
    let postBody = {
      name: this.validateForm.value["name"],
      desc: this.validateForm.value["desc"],
      id: this._id,
      tags: null,
    };
    if (
      this.playListDetail.tags != null &&
      this.playListDetail.tags.length > 0
    ) {
      postBody.tags = this.playListDetail.tags.join(";");
    }
    this.logger.LogDebug("提交的数据为：" + JSON.stringify(postBody));
    this.submitting = true;
    this.httpService
      .PostToServerThrow<emptyResult>("Playlist", "UpdatePlayList", postBody)
      .toPromise()
      .then((x) => this.nzMessageService.success("修改歌单信息成功!"))
      .catch((err) => this.nzMessageService.error("修改歌单信息失败"))
      .finally(() => (this.submitting = false));
  }
  public selectCatOk() {
    this.selectCatVisiable = false;
    let temp = this._cacheSelectedCat.findIndex(
      (x) => x.categoryTypeName == ""
    );
    if (temp != -1) {
      this._cacheSelectedCat.splice(temp, 1);
      this.nzMessageService.warning("全部歌单标签不被支持，已移除");
    }
    if (this._cacheSelectedCat.length > 3) {
      this.nzMessageService.error("最多只能选择3个标签！");
      return;
    }

    this.playListDetail.tags = this._cacheSelectedCat.map((x) => x.name);
  }
  public catSelectChange($event: selectCategoryEventArgs) {
    this._cacheSelectedCat = $event.selectedCategorys;
  }
}
