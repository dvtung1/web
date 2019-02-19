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
  private authStatusSub: Subscription; //listen to the subject
  isSuccess: boolean; //is user sign up successfully
  errMsg: string; //show user the error message
  isResend: boolean; //does user need to resend confirmation email
  constructor(private userAuthService: UserAuthService) {
    this.authStatusSub = new Subscription();
  }

  ngOnInit() {
    //listen from the server through the service subject
    this.authStatusSub.add(
      this.userAuthService.getAuthStatusListener().subscribe(respond => {
        //check if the user sign up successfully
        if (respond === "success") {
          this.isSuccess = true;
        } else {
          this.errMsg = respond;
        }
      })
    );
  }

  onSignUp(form: NgForm) {
    //get email and password input from the form
    var email = form.value.email;
    var password = form.value.password;
    this.userAuthService.createUser(email, password);
  }

  //resend email confirmation
  resendEmail() {
    this.userAuthService.resendConfirmation();
    this.isResend = true;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
