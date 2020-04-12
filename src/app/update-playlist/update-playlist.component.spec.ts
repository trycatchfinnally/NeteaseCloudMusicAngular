import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePlaylistComponent } from './update-playlist.component';

describe('UpdatePlaylistComponent', () => {
  let component: UpdatePlaylistComponent;
  let fixture: ComponentFixture<UpdatePlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
