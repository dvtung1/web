import { Component, OnInit } from "@angular/core";
import { DiningService } from 'src/app/services/dining.service';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  private tvStatusSub: Subscription;
  diningArray = [
    "1bowl",
    "earhart",
    "ford",
    "hillenbrand",
    "wiley",
    "windsor",
    "pete's za"
  ];
  

  //this has to be updated by backend for correctness
  // could maybe use tuples or dictionary for implementation?
  doc = [
    true,
    false,
    true,
    true,
    false,
    true,
    false
  ];

  constructor(
    private diningService: DiningService
  ) {
    //calls this on refresh
    this.tvStatusSub = new Subscription;
    this.diningService.checkOpenClosed();

  }

  ngOnInit() {
    this.tvStatusSub.add(
      this.diningService.getTvEmitter().subscribe(respond => {
        console.log("This is in home comp: " + respond);
        console.log(respond);
        this.doc = respond.tv.tvdc;
        console.log("doc");
        console.log(this.doc);
      })
    )
  }
}
