import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindsorComponent } from './windsor.component';

describe('WindsorComponent', () => {
  let component: WindsorComponent;
  let fixture: ComponentFixture<WindsorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindsorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
