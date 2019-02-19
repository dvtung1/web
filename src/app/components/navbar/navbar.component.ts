import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedIn = false;

constructor(private userAuthService: UserAuthService) {
  this.loggedIn = userAuthService.isUserAuthenticated();
}

  ngOnInit() {
  }

}
