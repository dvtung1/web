import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subject, Observable } from "rxjs";
import { Comment } from "../models/comment";
import { postComment } from "src/app/models/post-comment";

const BACKEND_URL = environment.apiUrl + "/dining";

@Injectable({
  providedIn: "root"
})
export class DiningService {
  private diningCourtEmitter = new Subject<any>();
  constructor(private http: HttpClient) {}

  /*
    Get comments with author name and rating from the server
    @param diningCourtName name of the specific dining court
    Windsor, Wiley, PeteZa, Bowl, Hillenbrand, Earhart, Ford
    @param diningType type of dining. Ex: breakfast, lunch, latelunch, dinner
    @return comments list which contain params (author, text, rating, objectId). Ex: comment.author
  */
  getComment(diningCourtName: string) {
    this.http
      .get<
        { author: string; text: string; rating: string; objectId: string }[]
      >(BACKEND_URL + "/comment?name=" + diningCourtName)
      .subscribe(
        respond => {
          var arrayComment: Comment[] = [];
          //get list of json object with author, text, rating, and objectId
          respond.forEach(comment => {
            var cmt = new Comment();
            cmt.text = comment.text;
            cmt.byUser = comment.author;
            cmt.rating = comment.rating;
            cmt.objectId = comment.objectId;
            //add cmt to the result array
            arrayComment.push(cmt);
          });
          this.diningCourtEmitter.next(arrayComment);
        },
        err => {
          console.log(err.error.message);
        }
      );
  }

  getDiningCourtEmitter(): Observable<any> {
    return this.diningCourtEmitter.asObservable();
  }

  postComment(inputComment: string, diningCourt: string) {
    var commentModel: postComment = {
      inputComment: inputComment,
      diningCourt: diningCourt
    };
    console.log(inputComment);
    console.log(diningCourt);
    this.http
      .post<{ message: string }>(BACKEND_URL + "/comment", commentModel)
      .subscribe(
        respond => {
          console.log(respond.message);
          //this.diningCourtEmitter.next("successfully posting user comment...");
          //window.alert("comment successfully posted");
        },
        error => {
          console.log(error.error.message);
          this.diningCourtEmitter.next(error.error.message);
        }
      );
  }
}
