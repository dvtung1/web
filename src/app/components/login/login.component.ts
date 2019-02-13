import { Component, OnInit } from "@angular/core";
import { UserAuthService } from "src/app/services/user-auth.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(private userAuthService: UserAuthService) {}

  ngOnInit() {}

  onLogIn(form: NgForm) {
    if (form.invalid) {
      return;
    }

    //get email and password input from the form
    var email = form.value.email;
    var password = form.value.password;
    this.userAuthService.signIn(email, password);
  }
}
