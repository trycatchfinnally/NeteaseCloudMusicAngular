import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidenavItemsComponent } from './slidenav-items.component';

describe('SlidenavItemsComponent', () => {
  let component: SlidenavItemsComponent;
  let fixture: ComponentFixture<SlidenavItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidenavItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidenavItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
