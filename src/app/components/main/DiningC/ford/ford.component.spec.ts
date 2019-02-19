import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FordComponent } from './ford.component';

describe('FordComponent', () => {
  let component: FordComponent;
  let fixture: ComponentFixture<FordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
