import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HillenbrandComponent } from './hillenbrand.component';

describe('HillenbrandComponent', () => {
  let component: HillenbrandComponent;
  let fixture: ComponentFixture<HillenbrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HillenbrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HillenbrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
