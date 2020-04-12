import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NzRegisterModalCustomComponent } from './nz-register-modal-custom.component';

describe('NzRegisterModalCustomComponent', () => {
  let component: NzRegisterModalCustomComponent;
  let fixture: ComponentFixture<NzRegisterModalCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NzRegisterModalCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NzRegisterModalCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
