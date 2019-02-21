import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirhartComponent } from './airhart.component';

describe('AirhartComponent', () => {
  let component: AirhartComponent;
  let fixture: ComponentFixture<AirhartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirhartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirhartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
