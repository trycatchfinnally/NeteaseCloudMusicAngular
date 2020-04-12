import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistCommentComponent } from './playlist-comment.component';

describe('PlaylistCommentComponent', () => {
  let component: PlaylistCommentComponent;
  let fixture: ComponentFixture<PlaylistCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
