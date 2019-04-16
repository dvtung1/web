import { Component } from "@angular/core";
import * as $ from "jquery";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private isFirstTime: boolean;

  ngOnInit(): void {
    //firstTime as the key
    let isFirstTime = localStorage.getItem("firstTime");
    // console.log(isFirstTime);

    if (isFirstTime !== "false") {
      this.isFirstTime = true;
      // $(document).ready(function() {
      //   $("#popup").modal("show");
      // });
    }
  }
  onAccept() {
    localStorage.setItem("firstTime", "false");
    this.isFirstTime = false;
  }
}
