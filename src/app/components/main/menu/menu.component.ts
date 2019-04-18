import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { DiningService } from "src/app/services/dining.service";
import { UserAuthService } from "src/app/services/user-auth.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
// import {JsonPipe} from "@angular/common"

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"]
})
export class MenuComponent implements OnInit {
  private authStatusSub: Subscription;
  private menuListener: Subscription;
  tempMenu: Comment[];
  fullMenu: Comment[];
  diningName: string; //diningName param for UI

  constructor(
    private userAuthService: UserAuthService,
    private diningService: DiningService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userAuthService.checkIfUserLoggedIn();
  }
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //check if contain diningName in the param route
      if (paramMap.has("diningName")) {
        this.authStatusSub = this.userAuthService
          .getAuthStatusListener()
          .subscribe(message => {
            console.log(message);
          });
        //get diningName from the param route
        this.diningName = paramMap.get("diningName");
        // showing the menu
        this.menuListener = this.diningService
          .getMenuUpdateEmitter()
          .subscribe(response => {
            this.tempMenu = response;
            // this.fullMenu = JSON.parse(response);
            console.log("fuck");
            console.log(this.tempMenu);
          });
        this.diningService.getMenus(this.diningName + "");
      }
    });
  }
  ngOnDestroy() {
    // this.diningListener.unsubscribe();
    this.authStatusSub.unsubscribe();
    // this.validCommentListener.unsubscribe();
    this.menuListener.unsubscribe();
  }
}
