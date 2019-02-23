import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { User } from "src/app/models/user";
import { Subject, Observable } from "rxjs";
import { Component } from "@angular/core";
import { Location } from "@angular/common";

//backend api url for communication (Port 3000)
// const BACKEND_URL = environment.apiUrl + "/user/";
const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({
  providedIn: "root"
})
export class UserAuthService {
  private userToken: string;
  private userId: string;
  private isAuthenticated: boolean;
  private authStatusListener = new Subject<any>(); //help with emit messages
  private emailSignUp: string; //email when the user sign up successfully, use when resend confirmation needed
  private currentUserEmail: string; // the current email of the user (when logged in)
  private currentUserName: string; // the current email of the user (when logged in)
  private isLoggedIn: boolean;

  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    var UserModel: User = {
      email: email,
      password: password
    };
    //send User info to the backend server
    this.http
      .post<{ message: string }>(BACKEND_URL + "/signup", UserModel)
      .subscribe(
        response => {
          console.log(response.message);
          this.authStatusListener.next("success");
          //if user create account successfully, save that email
          //to resend confirmation if needed
          this.emailSignUp = email;
        },
        error => {
          console.log(error.error.message);
          this.authStatusListener.next(error.error.message);
        }
      );
  }

  resendConfirmation() {
    //send email to the backend server
    this.http
      .post<{ message: string }>(BACKEND_URL + "/resend", {
        email: this.emailSignUp
      })
      .subscribe(
        response => {
          console.log(response.message);
        },
        error => {
          console.log(error.error.message);
        }
      );
  }

  signIn(email: string, password: string) {
    var UserModel: User = {
      email: email,
      password: password
    };
    //send user info to log in
    this.http
      .post<{ userToken: string; userId: string }>(
        BACKEND_URL + "/login",
        UserModel
      )
      .subscribe(
        response => {
          //save user token and id
          this.userToken = response.userToken;
          this.userId = response.userId;
          this.isAuthenticated = true;
          console.log("User has logged in succesfully... ");
          console.log("This is the user token!!!: " + this.userToken);
          console.log("this is the user id!!!!: " + this.userId);

          window.location.assign("/home");
          window.alert("Successfully logged in!");
          //TODO add new route when user successfully log in
          this.authStatusListener.next("authenticated");
        },
        error => {
          console.log(error.error.message);
          this.authStatusListener.next(error.error.message);
        }
      );
  }

  recoveryPassword(email: string) {
    //send email to backend server for recovery password
    this.http.post(BACKEND_URL + "/recovery", { email: email }).subscribe(
      () => {
        this.authStatusListener.next("success");
      },
      error => {
        console.log(error.error.message);
        this.authStatusListener.next(error.error.message);
      }
    );
  }

  changeUserEmail(newemail: string) {
    // change email
    console.log("This is the entered email: " + newemail);
    this.http
      .post<{ message: string }>(BACKEND_URL + "/modifyemail", {
        email: newemail
      })
      .subscribe(
        () => {
          this.authStatusListener.next("Esuccess");
        },
        error => {
          console.log(error.error.message);
          this.authStatusListener.next(error.error.message);
        }
      );
  }

  changeUserPassword(newpassword: string) {
    // change password
    console.log("This is the new entered password: " + newpassword);
    this.http
      .post<{ message: string }>(BACKEND_URL + "/modifypassword", {
        password: newpassword
      })
      .subscribe(
        () => {
          this.authStatusListener.next("Psuccess");
        },
        error => {
          console.log(error.error.message);
          this.authStatusListener.next(error.error.message);
        }
      );
  }

  changeUserUsername(newusername: string) {
    console.log("This is the new entered username: " + newusername);
    this.http
      .post<{ message: string }>(BACKEND_URL + "/modifyusername", {
        username: newusername
      })
      .subscribe(
        () => {
          this.authStatusListener.next("UNsuccess");
        },
        error => {
          console.log(error.error.message);
          this.authStatusListener.next(error.error.message);
        }
      );
  }

  logOut() {
    console.log("logging user out...");
    this.http.post<{ message: string }>(BACKEND_URL + "/logout", {}).subscribe(
      response => {
        console.log(response.message);
        window.alert("User successfully logged out...");
      },
      error => {
        console.log(error.error.message);
      }
    );
  }

  checkIfUserLoggedIn() {
    // change password
    console.log("Checking if User is Logged In...");
    this.http
      .get<{ message: string }>(BACKEND_URL + "/checkifloggedin")
      .subscribe(
        response => {
          // this is
          console.log(response.message);
          this.authStatusListener.next("loggedinsuccess");
        },
        error => {
          console.log(error.error.message);
          this.authStatusListener.next(error.error.message);
        }
      );
  }

  getCurrentUserInformation() {
    // get the user information
    console.log("Getting User Information...");
    this.http
      .get<{ userEmail: string; userUserName: string }>(
        BACKEND_URL + "/getcurrentuserinfo"
      )
      .subscribe(
        response => {
          this.currentUserEmail = response.userEmail;
          this.currentUserName = response.userUserName;
          //console.log("this is the currentuseremail: "+this.currentUserEmail);
          //console.log("this is the current user name: "+this.currentUserName);
          this.authStatusListener.next(this.currentUserEmail);
          this.authStatusListener.next(this.currentUserName);
          this.authStatusListener.next({
            email: this.currentUserEmail,
            username: this.currentUserName
          });
        },
        error => {
          console.log(error.error.message);
          this.authStatusListener.next(error.error.message);
        }
      );
  }

  getUserId(): string {
    return this.userId;
  }
  getUserToken(): string {
    return this.userToken;
  }
  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }
  getAuthStatusListener(): Observable<any> {
    return this.authStatusListener.asObservable();
  }
}
