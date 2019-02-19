import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarheartComponent } from './earheart.component';

describe('EarheartComponent', () => {
  let component: EarheartComponent;
  let fixture: ComponentFixture<EarheartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarheartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarheartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
