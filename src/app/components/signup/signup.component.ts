import { Component, OnInit } from "@angular/core";
import { UserAuthService } from "src/app/services/user-auth.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  constructor(private UserAuthService: UserAuthService) {}

  ngOnInit() {}

  onSignUp(form: NgForm) {}
}
