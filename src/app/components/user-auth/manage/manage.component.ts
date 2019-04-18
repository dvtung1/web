import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserAuthService } from "src/app/services/user-auth.service";
import { Subscription } from "rxjs";
import { DiningService } from "src/app/services/dining.service";

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
  editUsername: boolean = false; // if user pushed button for editing username
  isLoggedIn: boolean = false; // if user is currently logged in
  isESuccess: boolean = false; // if email change was successful
  isPSuccess: boolean = false; // if password change was successful
  isUNSuccess: boolean = false; // if username change was successful
  currentUserEmail: string = ""; // contains the current user email
  currentUserName: string = ""; // contains the current user email
  commentList: Comment[];
  commentListSize = "loading...";
  private userListener: Subscription;
  private menuListener: Subscription;

  constructor(
    private userAuthService: UserAuthService,
    private diningService: DiningService
  ) {
    // console.log("before");
    // this.isLoggedIn = userAuthService.isUserAuthenticated();
    // console.log("after");
    // console.log(this.isLoggedIn);
    this.authStatusSub = new Subscription();
    this.userAuthService.checkIfUserLoggedIn();
    this.userAuthService.getCurrentUserInformation();
    this.diningService.getCommentByUser();
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
        } else if (respond === "UNsuccess") {
          this.isUNSuccess = true;
        } else if (typeof respond == "object") {
          // console.log(respond);
          //console.log("Tdsfljdsal;fkj");
          this.currentUserEmail = respond.email;
          this.currentUserName = respond.username;

          // showing user's comments
          this.userListener = this.diningService
            .getCommentUpdateEmitter()
            .subscribe((respond: Comment[]) => {
              this.commentList = respond;
              this.commentListSize = this.commentList.length + "";
            });

          //console.log("USERNAME: "+ this.currentUserName);
          //console.log("EMAIL: "+ this.currentUserEmail);
        } else {
          this.errMsg = respond;
        }
      })
    );

    //showing user's comments
    this.userListener = this.diningService
      .getCommentUpdateEmitter()
      .subscribe((respond: any) => {
        console.log(respond);
        this.commentList = respond;
        this.commentListSize = this.commentList.length + "";
      });
  }

  //get the cUE inside ngOnInit then call subscribe then listen to response

  editEmailToggle() {
    this.editEmail = !this.editEmail;
  }
  editPasswordToggle() {
    this.editPassword = !this.editPassword;
  }
  editUsernameToggle() {
    this.editUsername = !this.editUsername;
  }

  changeEmail(value) {
    var newEmail = value;
    //console.log(newEmail);
    this.userAuthService.changeUserEmail(newEmail);
  }

  changePassword(value) {
    var newPassword = value;
    //console.log(newPassword);
    this.userAuthService.changeUserPassword(newPassword);
  }

  changeUsername(value) {
    var newUsername = value;
    this.userAuthService.changeUserUsername(newUsername);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
