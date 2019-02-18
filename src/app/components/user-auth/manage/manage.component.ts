import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  editEmail: boolean = false; // if use pused button for editing email
  editPassword: boolean = false; // if user pushed button for editing password
  
  constructor() { }

  ngOnInit() {
  }

  editEmailToggle() {
    this.editEmail = !this.editEmail;
  }
  editPasswordToggle() {
    this.editPassword = !this.editPassword;
  }
}
