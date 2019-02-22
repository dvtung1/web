import { Component, OnInit, OnDestroy } from "@angular/core";
import { DiningService } from "src/app/services/dining.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-ford",
  templateUrl: "./ford.component.html",
  styleUrls: ["./ford.component.css"]
})
export class FordComponent implements OnInit, OnDestroy {
  commentList: any[];
  private diningListener: Subscription;

  constructor(private diningService: DiningService) {}

  ngOnInit() {
    this.diningListener = this.diningService
      .getDiningCourtEmitter()
      .subscribe(respond => {
        this.commentList = respond;
      });
    this.diningService.getComment("Ford");
  }

  ngOnDestroy() {
    this.diningListener.unsubscribe();
  }
}
