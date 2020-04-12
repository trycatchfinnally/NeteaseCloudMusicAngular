import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NzCollectMusicModalCustomComponent } from './nz-collect-music-modal-custom.component';

describe('NzCollectMusicModalCustomComponent', () => {
  let component: NzCollectMusicModalCustomComponent;
  let fixture: ComponentFixture<NzCollectMusicModalCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NzCollectMusicModalCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NzCollectMusicModalCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
