import { Injectable } from "@angular/core";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { NzCommentModalCustomComponent } from "../nz-comment-modal-custom/nz-comment-modal-custom.component";
import { User } from "../DominModel/user";
import { CommandName } from "protractor";
import { DefaultHttpService } from "./default-http-service";
import { comment } from "../DominModel/comment";
import { LoginServiceService } from "./login-service.service";
import { LoggerService } from "./logger.service";

@Injectable({
  providedIn: "root"
})
export class AddCommentService {
  constructor(
    private nzModalService: NzModalService,
    private httpService: DefaultHttpService,
    private loginService: LoginServiceService,
    private nzMessageService: NzMessageService,
    private logger: LoggerService
  ) {}
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //验证登录
  private async checkAccess() {
    if (!this.loginService.IsLoginIn) {
      await this.loginService.LoginRequestedAsync();
      if (!this.loginService.IsLoginIn) return false;
    } else return true;
  }
  private async addCommentRequestImplAsync(
    commentThreadId: string,
    commentId?: string,
    toReplyUser?: User
  ) {
    if (!(await this.checkAccess())) {
      this.nzMessageService.error("你还没有登录额，不能使用评论功能！");
      return;
    }
    let fuck = true;
    if (commentId == null || toReplyUser == null) commentId = "";
    this.nzModalService
      .create({
        nzTitle:
          commentId.length == 0 ? "评论" : "回复@" + toReplyUser.userName + ":",
        nzFooter: null,
        nzContent: NzCommentModalCustomComponent,
        nzComponentParams: {
          commentThreadId,
          commentId
        }
      })
      .afterClose.subscribe(x => {
        if (x != null && x.data != null) {
          let result: boolean = x.data;
          if (result) this.nzMessageService.info("发送评论成功！");
          else this.nzMessageService.error("发送评论失败！");
        }
        fuck = false;
      });
    while (fuck) {
      await this.delay(200);
    }
    this.logger.LogInfo("发送评论服务已退出");
  }
  public addCommentAsync(commentThreadId: string) {
    return this.addCommentRequestImplAsync(commentThreadId);
  }
  public replayCommentAsync(
    commentThreadId: string,
    commentId: string,
    toReplyUser: User
  ) {
    return this.addCommentRequestImplAsync(
      commentThreadId,
      commentId,
      toReplyUser
    );
  }
  public thumnsUpComment(commentThreadId: string, comment: comment) {
    this.checkAccess().then(x => {
      if (x) {
        this.httpService
          .GetFromServer<string>("Comment", "ThumbsUpComment", {
            commentId: comment.commentId,
            commentThreadId,
            thumbsUp: !comment.liked
          })
          .toPromise()
          .then(() => this.nzMessageService.info("点赞评论成功！"))
          .then(() => (comment.liked = !comment.liked))
          .then(() => (comment.likedCount = comment.likedCount + 1))
          .catch(() =>
            this.nzMessageService.error("点赞评论失败，请稍后重试！")
          );
      } else {
        this.nzMessageService.error("你还没有登录额，不能使用评论点赞功能！");
      }
    });
  }
}
