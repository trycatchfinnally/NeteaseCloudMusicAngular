import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewestMusicsComponent } from './newest-musics.component';

describe('NewestMusicsComponent', () => {
  let component: NewestMusicsComponent;
  let fixture: ComponentFixture<NewestMusicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewestMusicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewestMusicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
