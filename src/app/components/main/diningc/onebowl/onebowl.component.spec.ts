import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnebowlComponent } from './onebowl.component';

describe('OnebowlComponent', () => {
  let component: OnebowlComponent;
  let fixture: ComponentFixture<OnebowlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnebowlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnebowlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
