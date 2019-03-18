import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subject, Observable } from "rxjs";
import { Comment } from "../models/comment";
import { postComment } from "src/app/models/post-comment";
import { Location } from "@angular/common";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { error } from 'protractor';

//backend api url for communication (Port 3000)
const BACKEND_URL = environment.apiUrl + "/dining";

@Injectable({
  providedIn: "root"
})
export class DiningService {
  private commentUpdateEmitter = new Subject<Comment[]>();
  private commentList: Comment[] = [];
  constructor(private http: HttpClient, private location: Location) {}

  /*
    Get comments with author name and rating from the server
    @param diningCourtName name of the specific dining court
    Windsor, Wiley, PeteZa, onebowl, Hillenbrand, Earhart, Ford
    @param diningType type of dining. Ex: breakfast, lunch, latelunch, dinner
    @return comments list which contain params (author, text, rating, objectId). Ex: comment.author
  */
  getComment(diningCourtName: string, diningType: string) {
    //diningCourtName = this.convertDiningNameBackend(diningCourtName);
    this.http
      .get<{
        message: string;
        comments: any;
      }>(
        BACKEND_URL + "/comment?name=" + diningCourtName + "&type=" + diningType
      )
      .pipe(
        map(respond => {
          return {
            message: respond.message,
            comments: respond.comments.map(comment => {
              return {
                text: comment.text,
                byUser: comment.author,
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

  postComment(inputComment: string, diningCourt: string, diningType: string) {
    var commentModel: postComment = {
      inputComment: inputComment,
      diningCourt: diningCourt,
      diningType: diningType
    };

    this.http
      .post<{
        message: string;
        text: string;
        author: string;
        rating: string;
        objectId: string;
        authorId: string;
      }>(BACKEND_URL + "/comment", commentModel)
      .subscribe(
        comment => {
          var cmt: Comment = {
            text: comment.text,
            byUser: comment.author,
            rating: comment.rating,
            objectId: comment.objectId,
            authorId: comment.authorId
          };
          //put the item at the first position in the list
          this.commentList.splice(0, 0, cmt);
          this.commentUpdateEmitter.next([...this.commentList]);
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
          const updatedCommentList = this.commentList.filter(
            comment => comment.objectId !== commentId
          );
          this.commentList = updatedCommentList;
          this.commentUpdateEmitter.next([...this.commentList]);
        },
        error => {
          console.log(error.error.message);
        }
      );
  }
  editComment(commentId: string) {
    this.http
    .get<{ message: string }>(BACKEND_URL + "/comment/get/" + commentId)
    
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
