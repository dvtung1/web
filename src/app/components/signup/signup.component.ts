import { Component, OnInit } from "@angular/core";
import { UserAuthService } from "src/app/services/user-auth.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  constructor(private userAuthService: UserAuthService) {}

  ngOnInit() {}

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
}
