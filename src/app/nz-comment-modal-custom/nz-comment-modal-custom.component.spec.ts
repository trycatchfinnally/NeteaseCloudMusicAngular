import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NzCommentModalCustomComponent } from './nz-comment-modal-custom.component';

describe('NzCommentModalCustomComponent', () => {
  let component: NzCommentModalCustomComponent;
  let fixture: ComponentFixture<NzCommentModalCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NzCommentModalCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NzCommentModalCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
