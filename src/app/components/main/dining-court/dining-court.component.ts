import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserAuthService } from "src/app/services/user-auth.service";
import { DiningService } from "src/app/services/dining.service";

import { Subscription } from "rxjs";
import { Comment } from "src/app/models/comment";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

import * as Filter from "bad-words";
import { CreateCommentComponent } from "../create-comment/create-comment.component";
@Component({
  selector: "app-dining-court",
  templateUrl: "./dining-court.component.html",
  styleUrls: ["./dining-court.component.css"]
})
export class DiningCourtComponent implements OnInit, OnDestroy {
  public isBarGraph = 1;
  private authStatusSub: Subscription;
  private diningListener: Subscription;
  // private menuListener: Subscription;
  private validCommentListener: Subscription;
  loggedIn = false;
  ifDeleted = false;
  userId: string = "";
  diningName: string; //diningName param for UI
  commentList: Comment[];
  commentListsize = "loading...";
  // menuList: Comment[];

  constructor(
    private userAuthService: UserAuthService,
    private diningService: DiningService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userAuthService.checkIfUserLoggedIn();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //check if contain diningName in the param route
      if (paramMap.has("diningName")) {
        this.authStatusSub = this.userAuthService
          .getAuthStatusListener()
          .subscribe(message => {
            console.log(message);
            if (message === "loggedinsuccess") {
              this.loggedIn = true;
              this.userId = this.userAuthService.getUserId();
            } else {
              this.loggedIn = false;
            }
          });
        //get diningName from the param route
        this.diningName = paramMap.get("diningName");

        //Showing all the comments
        this.diningListener = this.diningService
          .getCommentUpdateEmitter()
          .subscribe((respond: Comment[]) => {
            this.commentList = respond;
            this.commentListsize = this.commentList.length + "";
          });

        this.validCommentListener = this.diningService
          .getValidCommentEmitter()
          .subscribe(message => {
            console.log(message);
            if (message === "postcomsuccess") {
              window.alert("Comment Posted Successfully");
            }
          });

        //FIXME
        this.diningService.getComment(this.diningName, "");
      }
    });
  }
  ngOnDestroy() {
    this.diningListener.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.validCommentListener.unsubscribe();
    // this.menuListener.unsubscribe();
  }
  postComment(form: NgForm) {
    var inputComment = form.value.comment;
    (<HTMLInputElement>document.getElementById("comspace")).value = "";
    // var Filter = require('bad-words');
    var filter = new Filter();
    if (filter.isProfane(inputComment)) {
      switch (this.diningName) {
        case "1bowl":
          window.alert(
            "Your comment contains inappropriate language and will not be posted. Please post a new comment."
          );
          form.value.comment = " ";
          break;
        case "earhart":
          window.alert(
            "Your comment contains inappropriate language and will not be posted. Please post a new comment."
          );
          form.value.comment = " ";
          break;
        case "ford":
          window.alert(
            "Your comment contains inappropriate language and will not be posted. Please post a new comment."
          );
          break;
        case "hillenbrand":
          window.alert(
            "Your comment contains inappropriate language and will not be posted. Please post a new comment."
          );
          form.value.comment = " ";
          break;
        case "wiley":
          window.alert(
            "Your comment contains inappropriate language and will not be posted. Please post a new comment."
          );
          form.value.comment = " ";
          break;
        case "windsor":
          window.alert(
            "Your comment contains inappropriate language and will not be posted. Please post a new comment."
          );
          form.value.comment = " ";
          break;
        case "pete's za":
          window.alert(
            "Your comment contains inappropriate language and will not be posted. Please post a new comment."
          );
          form.value.comment = " ";
          break;
      }
    } else {
      //FIXME
      this.diningService.postComment(inputComment, this.diningName, "Dinner");
      //window.alert("Comment posted successfully!")
    }

    //retrieve message from the server
  }
  deleteComment(commentId: string) {
    this.diningService.removeComment(commentId);
  }
  middleState() {
    console.log("here2");
    window.location.assign("/dining/" + this.diningName + "/create");
  }
  editComment(commentId: string) {
    console.log("here");
    window.location.assign(
      "/dining/" + this.diningName + "/create/" + commentId
    );
    // this.router.navigate([
    //   "/dining/" + this.diningName + "/create?id=" + commentId
    // ]);
  }

  likeComment(commentId: string) {
    /*
    if (this.loggedIn) {
      console.log("likeComment call: " + commentId);
      this.diningService.likeComment(commentId);
    } else {
      console.log("Error Unauthorized: need to be logged in to like comment");
    }
    */
    this.diningService.likeComment(commentId);
  }
  switchGraph() {
    if (this.isBarGraph) {
      this.isBarGraph = 0;
    } else {
      this.isBarGraph = 1;
    }
  }
}
