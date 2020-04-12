import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserInfoComponent } from './change-user-info.component';

describe('ChangeUserInfoComponent', () => {
  let component: ChangeUserInfoComponent;
  let fixture: ComponentFixture<ChangeUserInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeUserInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
