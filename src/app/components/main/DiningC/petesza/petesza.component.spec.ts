import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeteszaComponent } from './petesza.component';

describe('PeteszaComponent', () => {
  let component: PeteszaComponent;
  let fixture: ComponentFixture<PeteszaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeteszaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeteszaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
