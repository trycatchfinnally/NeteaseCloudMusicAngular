import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EverydayMusicComponent } from './everyday-music.component';

describe('EverydayMusicComponent', () => {
  let component: EverydayMusicComponent;
  let fixture: ComponentFixture<EverydayMusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EverydayMusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EverydayMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
