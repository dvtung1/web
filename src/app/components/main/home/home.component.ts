import { Component, OnInit, OnDestroy } from "@angular/core";
import { DiningService } from 'src/app/services/dining.service';
import { GraphService } from 'src/app/services/graph.service';
import { Subscription } from 'rxjs';
import { OpenDining } from 'src/app/models/opendining';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, OnDestroy {
  
  private diningListener: Subscription;
  private graphListener: Subscription;
  private graphListenerq: any;

  openList: OpenDining[];
  sortedopenList: OpenDining[];
  closedList: String[];
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
    private diningService: DiningService,
    private graphService: GraphService
  ) {
    //calls this on refresh
    //this.diningService.checkOpenClosed();
    this.diningService.getMealTime();

  }

  ngOnInit() {
    this.diningListener = this.diningService
          .getopenEmitter()
          .subscribe((respond: OpenDining[]) => {
            this.openList = respond;
            this.openList.forEach(openddc => {
              //console.log(openddc.closedTime.substring(11, 16));
              openddc.closedTime = openddc.closedTime.substring(11, 16);
            });
            console.log("open: "+this.openList);

            for(let dc of this.openList){
              this.graphListener = this.graphService.getAverageRatings(dc.diningName)
              .subscribe( response => {
                //console.log("for: "+dc.diningName);
                //console.log(response);
                //console.log(response.ratings.averageScore);
                // will set the average score to zero if there is no data
                if(isNaN(response.ratings.averageScore) == false){
                  dc.avgScore = response.ratings.averageScore;
                }
                else{
                  dc.avgScore = 0;
                }

                // now have to sort the openList
                this.openList.sort(function(a: OpenDining, b:OpenDining){
                  return b.avgScore - a.avgScore;
                });
              });
            }
          });

    this.diningListener = this.diningService
          .getclosedEmitter()
          .subscribe(respond => {
            this.closedList = respond;
            console.log("closed: "+this.closedList);
          });
  }

  ngOnDestroy(){
    this.diningListener.unsubscribe();
    this.graphListener.unsubscribe();
  }

}


