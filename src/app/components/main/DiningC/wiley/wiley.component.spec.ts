import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WileyComponent } from './wiley.component';

describe('WileyComponent', () => {
  let component: WileyComponent;
  let fixture: ComponentFixture<WileyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WileyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WileyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
