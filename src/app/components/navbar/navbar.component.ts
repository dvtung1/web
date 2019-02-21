import { Component, OnInit } from "@angular/core";
import { UserAuthService } from "src/app/services/user-auth.service";
import { Subscription } from "rxjs";
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  loggedIn = false;
  private authStatusSub: Subscription;

  constructor(private userAuthService: UserAuthService) {
    this.authStatusSub = new Subscription();
    this.userAuthService.checkIfUserLoggedIn();
  }

  handleLink() {
    this.loggedIn = false;
  }

  ngOnInit() {
    this.authStatusSub = this.userAuthService
      .getAuthStatusListener()
      .subscribe(message => {
        console.log(message);
        if (
          message === "loggedinsuccess" ||
          message === "Esuccess" ||
          message === "Psuccess"
        ) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      });
  }
  logOut() {
    this.loggedIn = false;
    this.userAuthService.logOut();
  }
}
