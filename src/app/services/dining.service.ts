import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subject, Observable } from "rxjs";
import { Comment } from "../models/comment";

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
          console.log(err);
        }
      );
  }

  getDiningCourtEmitter(): Observable<any> {
    return this.diningCourtEmitter.asObservable();
  }
}
