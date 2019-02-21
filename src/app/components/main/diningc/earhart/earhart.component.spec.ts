import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarhartComponent } from './earhart.component';

describe('EarhartComponent', () => {
  let component: EarhartComponent;
  let fixture: ComponentFixture<EarhartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarhartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarhartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
