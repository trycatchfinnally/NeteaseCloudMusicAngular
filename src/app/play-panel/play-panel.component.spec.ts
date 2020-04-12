import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayPanelComponent } from './play-panel.component';

describe('PlayPanelComponent', () => {
  let component: PlayPanelComponent;
  let fixture: ComponentFixture<PlayPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
