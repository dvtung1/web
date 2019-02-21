import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  editEmail: boolean = false; // if user pushed button for editing email
  editPassword: boolean = false; // if user pushed button for editing password
  isLoggedIn: boolean = false; // if user is currently logged in
  usrtoken: string;
  constructor(private userAuthService: UserAuthService) {
    // console.log("before");
    // this.isLoggedIn = userAuthService.isUserAuthenticated();
    // this.usrtoken = userAuthService.getUserToken();
    // console.log("after");
    // console.log(this.isLoggedIn);
    // console.log(this.usrtoken);
  }

  ngOnInit() {
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

}
