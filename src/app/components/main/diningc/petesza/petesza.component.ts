import { Component, OnInit } from '@angular/core';
import { UserAuthService } from "src/app/services/user-auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-petesza',
  templateUrl: './petesza.component.html',
  styleUrls: ['./petesza.component.css']
})
export class PeteszaComponent implements OnInit {
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