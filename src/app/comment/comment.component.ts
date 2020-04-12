import {
  Component,
  OnInit,
  Input,

  TemplateRef,
  ViewContainerRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  CommentCollection
} from '../JsonResultModel/comment-collection';
import {
  DefaultHttpService
} from '../service/default-http-service';
import {
  AddCommentService
} from '../service/add-comment.service';
import {
  comment
} from '../DominModel/comment';



@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',

  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  // @ViewChild('rightPart', { read: ViewContainerRef }) container: ViewContainerRef;
  //  @Input("rightContent") rightContent: TemplateRef < void > ;
  @Input("commentThreadId") get commentThreadId() {
    return this._commentThreadId;
  }
  set commentThreadId(value: string) {
    this._commentThreadId = value;
    this.pageOffset = 1;
    this.changeCommentThreadId(this.commentThreadId);
  }
  public get limit() {
    return this._limit;
  }
  public set limit(value: number) {
    this._limit = value;

    this.changeCommentThreadId(this.commentThreadId);
  }
  public get pageOffset() {
    return this._pageOffset;
  }
  public set pageOffset(value: number) {
    this._pageOffset = value;
    this.changeCommentThreadId(this.commentThreadId);
  }
  public commentCollection: CommentCollection;
  private _commentThreadId: string;
  private _limit = 20;
  private _pageOffset = 1;
  constructor(private httpService: DefaultHttpService, private addCommentService: AddCommentService) {

  }

  ngOnInit() {


  }
  // ngAfterViewInit() {
  //   this.container.clear();

  //   this.container.createEmbeddedView(
  // 		this.rightContent
  // 	);
  // }

  private changeCommentThreadId(commentThreadId: string) {
    //this.commentThreadId = commentThreadId;
    this.httpService.
    GetFromServer < CommentCollection > ("Common", "GetCommentById", {
        commentThreadId: commentThreadId,
        offset: (this.pageOffset - 1) * this.limit,
        limit: this.limit
      })
      .subscribe(x => {
        this.commentCollection = x;


      });
  }
  public changePage(value: number) {
    this.pageOffset = value;
  }
  public changePageSize(value: number) {
    this.limit = value;

  }
  public addCommentClick() {
    this.addCommentService.addCommentAsync(this.commentThreadId);
  }
  public replyCommentClick(comment: comment) {
    this.addCommentService.replayCommentAsync(this.commentThreadId, comment.commentId.toString(), comment.user);
  }
  public thumbsUpComment(comment: comment) {
    this.addCommentService.thumnsUpComment(this.commentThreadId, comment);
  }
}
