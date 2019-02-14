import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserAuthService } from "src/app/services/user-auth.service";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  isSuccess: boolean;
  errMsg: string;
  isResend: boolean;
  constructor(private userAuthService: UserAuthService) {}

  ngOnInit() {
    this.authStatusSub = this.userAuthService
      .getAuthStatusListener()
      .subscribe(respond => {
        if (respond === "success") {
          this.isSuccess = true;
        } else {
          this.errMsg = respond;
        }
      });
  }

  onSignUp(form: NgForm) {
    //check if form is valid or not
    if (form.invalid) {
      return;
    }

    //get email and password input from the form
    var email = form.value.email;
    var password = form.value.password;
    this.userAuthService.createUser(email, password);
  }

  resendEmail() {
    this.userAuthService.resendConfirmation();
    this.isResend = true;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
