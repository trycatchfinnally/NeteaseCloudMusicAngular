import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AEventItemComponent } from './a-event-item.component';

describe('AEventItemComponent', () => {
  let component: AEventItemComponent;
  let fixture: ComponentFixture<AEventItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AEventItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AEventItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
