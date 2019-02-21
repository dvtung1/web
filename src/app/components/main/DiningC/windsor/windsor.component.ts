import { Component, OnInit } from '@angular/core';
import { UserAuthService } from "src/app/services/user-auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-windsor',
  templateUrl: './windsor.component.html',
  styleUrls: ['./windsor.component.css']
})
export class WindsorComponent implements OnInit {
  loggedIn = false
  private authStatusSub: Subscription;

  constructor(private userAuthService: UserAuthService) {
    this.authStatusSub = new Subscription();
    this.userAuthService.checkIfUserLoggedIn();
  }

  ngOnInit() {
    this.authStatusSub = this.userAuthService
      .getAuthStatusListener()
      .subscribe(message => {
        console.log(message);
        if (
          message === "loggedinsuccess"
        ) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      });
  }
}
