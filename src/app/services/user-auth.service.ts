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
  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    var UserModel: UserModel = {
      email: email,
      password: password
    };
    this.http.post(BACKEND_URL + "/signup", UserModel).subscribe(response => {
      console.log(response);
    });
  }
}
