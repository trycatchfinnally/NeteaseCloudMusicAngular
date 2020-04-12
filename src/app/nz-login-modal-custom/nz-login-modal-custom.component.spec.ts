import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NzLoginModalCustomComponent } from './nz-login-modal-custom.component';

describe('NzLoginModalCustomComponent', () => {
  let component: NzLoginModalCustomComponent;
  let fixture: ComponentFixture<NzLoginModalCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NzLoginModalCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NzLoginModalCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
