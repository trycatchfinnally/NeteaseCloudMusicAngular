import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistcategorysComponent } from './playlistcategorys.component';

describe('PlaylistcategorysComponent', () => {
  let component: PlaylistcategorysComponent;
  let fixture: ComponentFixture<PlaylistcategorysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistcategorysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistcategorysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
