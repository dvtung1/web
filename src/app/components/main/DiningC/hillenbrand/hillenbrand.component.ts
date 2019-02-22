import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserAuthService } from "src/app/services/user-auth.service";
import { DiningService } from "src/app/services/dining.service";

import { Subscription } from "rxjs";
import { Comment } from "src/app/models/comment";

@Component({
  selector: 'app-hillenbrand',
  templateUrl: './hillenbrand.component.html',
  styleUrls: ['./hillenbrand.component.css']
})
export class HillenbrandComponent implements OnInit, OnDestroy {
  commentList: Comment[];
  loggedIn = false
  private authStatusSub: Subscription;
  private diningListener: Subscription;

  constructor(
    private userAuthService: UserAuthService,
    private diningService: DiningService
    ) {
    this.userAuthService.checkIfUserLoggedIn();
  }

  ngOnInit() {
    this.authStatusSub = this.userAuthService
      .getAuthStatusListener()
      .subscribe(message => {
        console.log(message);
        if (message === "loggedinsuccess") {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      });
      
    //Showing all the comments
    this.diningListener = this.diningService
      .getDiningCourtEmitter()
      .subscribe(respond => {
        this.commentList = respond;
      });
    this.diningService.getComment("Hillenbrand");
  }
  ngOnDestroy() {
    this.diningListener.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
