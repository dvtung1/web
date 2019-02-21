import { Component, OnInit } from "@angular/core";
import { DiningService } from "src/app/services/dining.service";

@Component({
  selector: "app-airhart",
  templateUrl: "./airhart.component.html",
  styleUrls: ["./airhart.component.css"]
})
export class AirhartComponent implements OnInit {
  constructor(private diningService: DiningService) {}

  ngOnInit() {
    this.diningService.getComment("Earhart");
  }
}
