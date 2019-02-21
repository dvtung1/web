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
}
  ngOnInit() {
    this.authStatusSub = this.userAuthService.getAuthStatusListener().subscribe(message => {
      console.log(message);
      if(message === "authenticated"){
        this.loggedIn = true;
      }
    });
  }



}
