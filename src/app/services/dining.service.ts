import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subject, Observable } from "rxjs";
import { Comment } from "../models/comment";
import { postComment } from "src/app/models/post-comment";
import { Location } from "@angular/common";
import { map } from "rxjs/operators";
import { OpenDining } from "../models/opendining";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";

//backend api url for communication (Port 3000)
const BACKEND_URL = environment.apiUrl + "/dining";
@Injectable({
  providedIn: "root"
})
export class DiningService {
  private commentUpdateEmitter = new Subject<any[]>();
  private commentList: Comment[] = [];
  private openList: OpenDining[] = [];
  private openEmitter = new Subject<OpenDining[]>();
  private closedEmitter = new Subject<any>();
  private validCommentEmitter = new Subject<any>();
  private commentByIdEmitter = new Subject<any>();
  private tvEmitter = new Subject<any>();
  constructor(private http: HttpClient, private location: Location) {}

  /*
    Get comments with author name and rating from the server
    @param diningCourtName name of the specific dining court
    Windsor, Wiley, PeteZa, onebowl, Hillenbrand, Earhart, Ford
    @param diningType type of dining. Ex: breakfast, lunch, latelunch, dinner
    @return comments list which contain params (author, text, rating, objectId). Ex: comment.author
  */
  getComment(diningCourtName: string, diningType: string) {
    var url = BACKEND_URL + "/comment?name=" + diningCourtName;

    if (diningType !== "") {
      url += "&type=" + diningType;
    }
    this.http
      .get<{
        message: string;
        comments: any;
      }>(url)
      .pipe(
        map(respond => {
          return {
            message: respond.message,
            comments: respond.comments.map(comment => {
              return {
                //diningName: re
                text: comment.text,
                byUser: comment.author,
                rating: comment.rating,
                objectId: comment.objectId,
                authorId: comment.authorId,
                likes: comment.likes
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

  //TODO missing likes
  getCommentById(commentId: string) {
    this.http
      .get<{
        author: string;
        text: string;
        rating: string;
        objectId: string;
        authorId: string;
        diningType: string;
      }>(BACKEND_URL + "/comment/" + commentId)
      .subscribe(
        response => {
          var cmt = {
            diningType: response.diningType,
            text: response.text
          };
          this.commentByIdEmitter.next(cmt);
        },
        err => {
          console.log(err.error.message);
        }
      );
  }

  getCommentByIdEmitter() {
    return this.commentByIdEmitter.asObservable();
  }

  //TODO missing likes
  getCommentByUser() {
    this.http
      .get<{
        message: string;
        comments: any;
      }>(BACKEND_URL + "/comment/user")
      .subscribe(
        response => {
          var array = [];
          response.comments.forEach(comment => {
            var cmt = {
              diningName: comment.diningName,
              diningType: comment.diningType,
              text: comment.text,
              byUser: comment.author,
              rating: comment.rating,
              objectId: comment.objectId,
              authorId: comment.authorId
            };
            array.push(cmt);
          });
          // console.log("HI");
          // console.log(array);
          this.commentUpdateEmitter.next([...array]);
        },
        error => {
          console.log(error.error.message);
          //this.authStatusListener.next(error.error.message);
        }
      );
  }

  getCommentUpdateEmitter(): Observable<any> {
    return this.commentUpdateEmitter.asObservable();
  }

  getValidCommentEmitter(): Observable<any> {
    return this.validCommentEmitter.asObservable();
  }

  getopenEmitter(): Observable<any> {
    return this.openEmitter.asObservable();
  }

  getclosedEmitter(): Observable<any> {
    return this.closedEmitter.asObservable();
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
        comment: {
          text: string;
          author: string;
          rating: string;
          objectId: string;
          authorId: string;
        };
      }>(BACKEND_URL + "/comment", commentModel)
      .subscribe(
        respond => {
          var cmt: Comment = {
            text: respond.comment.text,
            byUser: respond.comment.author,
            rating: respond.comment.rating,
            objectId: respond.comment.objectId,
            authorId: respond.comment.authorId,
            likes: 0
          };
          //put the item at the first position in the list
          this.commentList.splice(0, 0, cmt);
          this.commentUpdateEmitter.next([...this.commentList]);
          this.validCommentEmitter.next("postcomsuccess");
        },
        error => {
          console.log(error.error.message);
        }
      );
  }

  removeComment(commentId: string) {
    this.http
      .delete<{ message: string }>(BACKEND_URL + "/comment/" + commentId)
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
  editComment(commentId: string, text: string) {
    this.http
      .patch<{ message: string }>(BACKEND_URL + "/comment/" + commentId, {
        text: text
      })
      .subscribe(
        respond => {
          const updatedComments = [...this.commentList];
          const oldCommentIndex = updatedComments.findIndex(
            comment => comment.objectId === commentId
          );
          updatedComments[oldCommentIndex].text = text;
          this.commentList = updatedComments;
          this.commentUpdateEmitter.next([...this.commentList]);
        },
        error => {
          console.log(error.error.message);
        }
      );
  }

  getMealTime() {
    this.http
      .get<{
        message: string;
        openDiningCourts: any;
        closedDiningCourts: any;
      }>(BACKEND_URL + "/mealtime")
      .pipe(
        map(respond => {
          return {
            message: respond.message,
            opens: respond.openDiningCourts.map(open => {
              return {
                diningName: open.diningName,
                diningType: open.diningType,
                openedTime: open.openedTime,
                closedTime: open.closedTime
              };
            }),
            closedDiningCourts: respond.closedDiningCourts
          };
        })
      )
      .subscribe(
        response => {
          //console.log("This respond.message: "+ response.message);
          //console.log(response.opens);
          //console.log("sdfas: " );
          this.openList = response.opens;
          this.openEmitter.next([...this.openList]);
          this.closedEmitter.next(response.closedDiningCourts);
        },
        err => {
          console.log(err.message);
        }
      );
  }

  checkOpenClosed() {
    this.http
      .get<{
        message: any;
        //opendc: any;
        //closeddc: any;
        tvdc: any;
      }>(BACKEND_URL + "/checkopenclosed")
      .subscribe(
        response => {
          console.log(response);
          //var obj = JSON.parse(response.tvdc);
          //console.log(obj);
          console.log(response.tvdc);
          console.log("here before");
          console.log(response.message);
          //console.log("Checking return value open: " + response.opendc);
          //console.log(response.opendc)
          //console.log("Checking return value closed: " + response.closeddc);
          //console.log(response.closeddc);
          console.log("truth values: " + response.tvdc);
          console.log(response.tvdc);
          console.log("here after");
          // need a different "emitter" to update the doc table
          this.tvEmitter.next(response);
        },
        error => {
          console.log(error.error.message);
          this.tvEmitter.next(error.error.message);
        }
      );
  }
  likeComment(commentId: string) {
    this.http
      .post<{
        message: string;
      }>(BACKEND_URL + "/like/" + commentId, {})
      .subscribe(
        respond => {
          const updatedComments = [...this.commentList];
          const oldCommentIndex = updatedComments.findIndex(
            comment => comment.objectId === commentId
          );
          updatedComments[oldCommentIndex].likes++;
          this.commentList = updatedComments;
          this.commentUpdateEmitter.next([...this.commentList]);
        },
        error => {
          console.log(error.error.message);
        }
      );
  }
}
