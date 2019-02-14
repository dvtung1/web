import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserAuthService } from "src/app/services/user-auth.service";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  errMsg: string;

  constructor(private userAuthService: UserAuthService) {}

  ngOnInit() {
    this.authStatusSub = this.userAuthService
      .getAuthStatusListener()
      .subscribe(respond => {
        this.errMsg = respond;
      });
  }

  onLogIn(form: NgForm) {
    if (form.invalid) {
      return;
    }

    //get email and password input from the form
    var email = form.value.email;
    var password = form.value.password;
    this.userAuthService.signIn(email, password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
