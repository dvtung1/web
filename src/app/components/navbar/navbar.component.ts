import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedIn = false;
  private authStatusSub: Subscription;

constructor(private userAuthService: UserAuthService) {
<<<<<<< HEAD
=======
  this.authStatusSub = new Subscription();
  this.userAuthService.checkIfUserLoggedIn();
>>>>>>> 97b82f011693a0d3477718130a3ff8c705950a61
}
  ngOnInit() {
    this.authStatusSub = this.userAuthService.getAuthStatusListener().subscribe(message => {
      console.log(message);
<<<<<<< HEAD
      if(message === "authenticated"){
        this.loggedIn = true;
      }
=======
      if(message === "loggedinsuccess" || message === "Esuccess" || message === "Psuccess"){
        this.loggedIn = true;
      }
      else{
        this.loggedIn = false;
      }
>>>>>>> 97b82f011693a0d3477718130a3ff8c705950a61
    });
  }



}
