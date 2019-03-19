import { Component, OnInit } from "@angular/core";
import { DiningService } from "src/app/services/dining.service";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "app-create-comment",
  templateUrl: "./create-comment.component.html",
  styleUrls: ["./create-comment.component.css"]
})
export class CreateCommentComponent implements OnInit {
  diningName: string;
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
    var inputComment = form.value.comment;
    //FIXME
    this.diningService.postComment(inputComment, this.diningName, "Dinner");
  }
}
