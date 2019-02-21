import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserAuthService } from "src/app/services/user-auth.service";
import { NgForm } from "@angular/forms";
import { Subscription, Subject } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription; //listen to server through subject emitter
  errMsg: string; //error message
  private authStatusListener = new Subject<string>(); //help with emit messages

  constructor(private userAuthService: UserAuthService) {
    this.authStatusSub = new Subscription();
  }

  ngOnInit() {
    //get the respond when user try to log in
    this.authStatusSub.add(
      this.userAuthService.getAuthStatusListener().subscribe(respond => {
<<<<<<< HEAD
        if (respond === "authenticated") {
          this.authStatusListener.next("authenticated");
        } else {
          this.errMsg = respond;
=======
        if(respond === "authenticated"){
          this.authStatusListener.next("authenticated");
        }else{
        this.errMsg = respond;
>>>>>>> 97b82f011693a0d3477718130a3ff8c705950a61
        }
      })
    );
  }

  onLogIn(form: NgForm) {
    //get email and password input from the form
    var email = form.value.email;
    var password = form.value.password;
    this.userAuthService.signIn(email, password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

<<<<<<< HEAD
  getAuthStatusListener() {
=======
  getAuthStatusListener(){
>>>>>>> 97b82f011693a0d3477718130a3ff8c705950a61
    return this.authStatusListener.asObservable();
  }
}
