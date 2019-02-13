import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { UserModel } from "src/app/models/UserAuth.model";

//backend api url for communication (Port 3000)
// const BACKEND_URL = environment.apiUrl + "/user/";
const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({
  providedIn: "root"
})
export class UserAuthService {
  private userToken: string;
  private userId: string;
  private isAuthenticated: boolean = false;

  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    var UserModel: UserModel = {
      email: email,
      password: password
    };
    this.http
      .post<{ message: string }>(BACKEND_URL + "/signup", UserModel)
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
    var UserModel: UserModel = {
      email: email,
      password: password
    };
    this.http
      .post<{ userToken: string; userId: string }>(
        BACKEND_URL + "/login",
        UserModel
      )
      .subscribe(
        response => {
          this.userToken = response.userToken;
          this.userId = response.userId;
          this.isAuthenticated = true;
          console.log("User has logged in succesfully");
        },
        error => {
          console.log(error.error.message);
        }
      );
  }
}
