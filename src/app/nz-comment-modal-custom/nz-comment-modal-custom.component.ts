import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  NzModalRef
} from 'ng-zorro-antd';
import {
  DefaultHttpService
} from '../service/default-http-service';

@Component({
  selector: 'app-nz-comment-modal-custom',
  templateUrl: './nz-comment-modal-custom.component.html',
  styleUrls: ['./nz-comment-modal-custom.component.css']
})
export class NzCommentModalCustomComponent implements OnInit {
  @Input() commentThreadId: string;
  @Input() commentId: string;
  public commentContent = "";
  public submitLoadding = false;
  constructor(private modalRef: NzModalRef, private http: DefaultHttpService) {}

  ngOnInit() {}
  private destroyModal(addSuccess: boolean) {
    this.modalRef.destroy({
      data: addSuccess
    });
  }
  public commentCommint() {
    this.submitLoadding = true;
    if (this.commentId == null || this.commentId.length == 0) {
      this.http.GetFromServer < string > ("Comment", "AddComment", {
          commentThreadId: this.commentThreadId,
          content: this.commentContent
        })
        .toPromise().then(x => this.submitLoadding = false)
        .then(() => this.destroyModal(true)).catch(() => this.destroyModal(false));
    } else {
      this.http.GetFromServer < string > ("Comment", "ReplyComment", {
          commentThreadId: this.commentThreadId,
          content: this.commentContent,
          commentId: this.commentId
        })
        .toPromise().then(x => this.submitLoadding = false)
        .then(() => this.destroyModal(true)).catch(() => this.destroyModal(false));
    }
  }
}
