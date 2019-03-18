import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DiningCourtComponent } from "./dining-court.component";

describe("DiningCourtComponent", () => {
  let component: DiningCourtComponent;
  let fixture: ComponentFixture<DiningCourtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiningCourtComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningCourtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
