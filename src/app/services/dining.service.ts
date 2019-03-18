import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subject, Observable } from "rxjs";
import { Comment } from "../models/comment";
import { postComment } from "src/app/models/post-comment";
import { Location } from "@angular/common";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

//backend api url for communication (Port 3000)
const BACKEND_URL = environment.apiUrl + "/dining";

@Injectable({
  providedIn: "root"
})
export class DiningService {
  private commentUpdateEmitter = new Subject<Comment[]>();
  private commentList: Comment[] = [];
  constructor(
    private http: HttpClient,
    private location: Location,
    private router: Router
  ) {}

  /*
    Get comments with author name and rating from the server
    @param diningCourtName name of the specific dining court
    Windsor, Wiley, PeteZa, onebowl, Hillenbrand, Earhart, Ford
    @param diningType type of dining. Ex: breakfast, lunch, latelunch, dinner
    @return comments list which contain params (author, text, rating, objectId). Ex: comment.author
  */
  getComment(diningCourtName: string) {
    diningCourtName = this.convertDiningNameBackend(diningCourtName);
    this.http
      .get<{
        message: string;
        comments: any;
      }>(BACKEND_URL + "/comment?name=" + diningCourtName)
      .pipe(
        map(respond => {
          return {
            message: respond.message,
            comments: respond.comments.map(comment => {
              return {
                text: comment.text,
                byUser: comment.author,
                byDiningTiming: "",
                rating: comment.rating,
                objectId: comment.objectId,
                authorId: comment.authorId
              };
            })
          };
        })
      )
      .subscribe(
        transformedRespond => {
          this.commentList = transformedRespond.comments;
          this.commentUpdateEmitter.next([...this.commentList]);
        },
        err => {
          console.log(err.error.message);
        }
      );
  }

  getCommentUpdateEmitter(): Observable<any> {
    return this.commentUpdateEmitter.asObservable();
  }

  postComment(inputComment: string, diningCourt: string) {
    var commentModel: postComment = {
      inputComment: inputComment,
      diningCourt: diningCourt
    };

    this.http
      .post<{ message: string }>(BACKEND_URL + "/comment", commentModel)
      .subscribe(
        respond => {
          //TODO
          //location.reload();
          this.router.navigate(["/dining/" + diningCourt]);
        },
        error => {
          console.log(error.error.message);
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
  getCommentList(): Comment[] {
    return this.commentList;
  }

  convertDiningNameBackend(diningNameFrontend): string {
    //convert some diningName so backend can understand
    if (diningNameFrontend === "1bowl") {
      return "onebowl";
    } else if (diningNameFrontend === "pete's za") {
      return "peteza";
    }
    return diningNameFrontend;
  }
}
