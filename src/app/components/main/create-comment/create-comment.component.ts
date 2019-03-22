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
  textMessage: string;
  diningType: string;
  commentId: string;
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
      if (paramMap.has("id")) {
        this.commentId = paramMap.get("id");

        this.diningService.getCommentByIdEmitter().subscribe(comment => {
          this.diningType = comment.diningType.toLowerCase();
          this.textMessage = comment.text;
        });
        this.diningService.getCommentById(this.commentId);
      }
    });
  }

  postComment(form: NgForm) {
    if (form.invalid) {
      console.log("Invalid");
      return;
    }
    var inputComment = form.value.comment;
    if (this.commentId == null) {
      this.diningService.postComment(
        inputComment,
        this.diningName,
        this.diningType
      );
    } else {
      this.diningService.editComment(this.commentId, this.textMessage);
    }
  }
}
