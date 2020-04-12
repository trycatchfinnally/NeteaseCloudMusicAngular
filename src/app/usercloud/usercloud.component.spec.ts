import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercloudComponent } from './usercloud.component';

describe('UsercloudComponent', () => {
  let component: UsercloudComponent;
  let fixture: ComponentFixture<UsercloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsercloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsercloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
