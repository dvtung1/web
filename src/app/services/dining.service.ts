import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subject, Observable } from "rxjs";
import { Comment } from "../models/comment";
import { postComment } from "src/app/models/post-comment";
import { Location } from "@angular/common";

//backend api url for communication (Port 3000)
const BACKEND_URL = environment.apiUrl + "/dining";

@Injectable({
  providedIn: "root"
})
export class DiningService {
  private diningCourtEmitter = new Subject<any>();
  constructor(private http: HttpClient, private location: Location) {}

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
        {
          author: string;
          text: string;
          rating: string;
          objectId: string;
          authorId: string;
        }[]
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
            cmt.authorId = comment.authorId;
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
          //reload the page right after the comment get into the database
          location.reload();
          //this.diningCourtEmitter.next("successfully posting user comment...");
        },
        error => {
          console.log(error.error.message);
          //this.diningCourtEmitter.next(error.error.message);
        }
      );
  }
  removeComment(commentId: string) {
    this.http
      .delete<{ message: string }>(BACKEND_URL + "/comment/delete/" + commentId)
      .subscribe(
        respond => {
          location.reload();
          console.log(respond);
        },
        error => {
          console.log(error.error.message);
        }
      );
  }
}
