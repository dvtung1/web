import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { UserAuthService } from "src/app/services/user-auth.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-recovery",
  templateUrl: "./recovery.component.html",
  styleUrls: ["./recovery.component.css"]
})
export class RecoveryComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription; //listen to the server through subject
  isSuccess: boolean; //if the user recovery password successfully
  errMsg: string; //error message
  constructor(private userAuthService: UserAuthService) {}

  ngOnInit() {
    //listen to the respond when user try to recovery their password
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

  onRecovery(form: NgForm) {
    var email = form.value.email;
    this.userAuthService.recoveryPassword(email);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
