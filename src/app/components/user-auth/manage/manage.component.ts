import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserAuthService } from "src/app/services/user-auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.css"]
})
export class ManageComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription; //listen to the subject
  errMsg: string; //show user the error message
  editEmail: boolean = false; // if user pushed button for editing email
  editPassword: boolean = false; // if user pushed button for editing password
  isLoggedIn: boolean = false; // if user is currently logged in
  isESuccess: boolean = false; // if email change was successful
  isPSuccess: boolean = false; // if password change was successful
  currentUserEmail: string = ""; // contains the current user email
  currentUserName: string = ""; // contains the current user email

  constructor(private userAuthService: UserAuthService) {
    // console.log("before");
    // this.isLoggedIn = userAuthService.isUserAuthenticated();
    // console.log("after");
    // console.log(this.isLoggedIn);
    this.authStatusSub = new Subscription();
    this.userAuthService.checkIfUserLoggedIn();
    this.userAuthService.getCurrentUserInformation();
  }

  ngOnInit() {
    this.authStatusSub.add(
      this.userAuthService.getAuthStatusListener().subscribe(respond => {
        //check if the user sign up successfully
        //console.log("This is respond: "+respond);
        if (respond === "loggedinsuccess") {
          this.isLoggedIn = true;
        } else if (respond === "Esuccess") {
          this.isESuccess = true;
        } else if (respond === "Psuccess") {
          this.isPSuccess = true;
        } 
        else if (typeof respond == 'object'){
          //console.log("Tdsfljdsal;fkj");
          this.currentUserEmail = respond.email;
          this.currentUserName = respond.username;
          //console.log("USERNAME: "+ this.currentUserName);
          //console.log("EMAIL: "+ this.currentUserEmail);
        }
        else {
          this.errMsg = respond;
        }
      })
    );
  }

  editEmailToggle() {
    this.editEmail = !this.editEmail;
  }
  editPasswordToggle() {
    this.editPassword = !this.editPassword;
  }

  changeEmail(value) {
    var newEmail = value;
    // TODO: write it to the backend
    //console.log(newEmail);
    this.userAuthService.changeUserEmail(newEmail);
  }

  changePassword(value) {
    var newPassword = value;
    // TODO: write it to the backend
    //console.log(newPassword);
    this.userAuthService.changeUserPassword(newPassword);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
