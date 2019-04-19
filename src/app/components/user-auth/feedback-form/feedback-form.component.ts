import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import * as emailjs from "emailjs-com";
import { UserAuthService } from "src/app/services/user-auth.service";

@Component({
  selector: "app-feedback-form",
  templateUrl: "./feedback-form.component.html",
  styleUrls: ["./feedback-form.component.css"]
})
export class FeedbackFormComponent implements OnInit {
  constructor(private userService: UserAuthService) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.userService
      .sendBug(form.value.type, form.value.description)
      .subscribe(respond => {
        window.alert(
          "Your feedback form details have been emailed to the developers of PUrfect Dining. Thank you!"
        );
        console.log(respond.message);
      });
    // var templateParams = {
    //   type: form.value.type,
    //   message: form.value.description
    // };
    // emailjs
    //   .send(
    //     "default_service",
    //     "template_C3BMxenJ",
    //     templateParams
    //     // "user_SeWQjQOO1vwlKhpo5cFB8"
    //   )
    //   .then(response => {
    //     console.log(response.text);
    //   })
    //   .catch(err => {
    //     console.log(err.text);
    //   });

    form.reset();
  }
}
