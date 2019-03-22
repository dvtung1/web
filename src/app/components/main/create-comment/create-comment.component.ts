import { Component, OnInit } from "@angular/core";
import { DiningService } from "src/app/services/dining.service";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import * as Filter from "bad-words";

@Component({
  selector: "app-create-comment",
  templateUrl: "./create-comment.component.html",
  styleUrls: ["./create-comment.component.css"]
})
export class CreateCommentComponent implements OnInit {
  diningName: string;
  diningType: string;
  constructor(
    private diningService: DiningService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //check if contain diningName in the param route
      if (paramMap.has("diningName")) {
        //get diningName from the param route
        this.diningName = paramMap.get("diningName");
      }
    });
  }

  postComment(form: NgForm) {
    if (form.invalid) {
      console.log("Invalid");
      return;
    }
    var inputComment = form.value.comment;
    var filter = new Filter();
    if (filter.isProfane(inputComment)) {
      window.alert("Your comment will not be posted due to the presence of obscene language, please");
    } else{
      var inputComment = form.value.comment;
      this.diningService.postComment(
      inputComment,
      this.diningName,
      this.diningType
    );
    //setTimeout(function(){ window.alert("valid comment")}, 3000);
    window.alert("valid comment posted");
    window.location.assign("/dining/" + this.diningName);
    }
  }

  getDiningType(diningType: string) {
    this.diningType = diningType;
  }
}
