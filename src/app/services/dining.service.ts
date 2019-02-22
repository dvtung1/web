import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subject, Observable } from "rxjs";

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
    @return comments list which contain params (author, text, rating). Ex: comment.author
  */
  getComment(diningCourtName: string) {
    this.http
      .get<any[]>(BACKEND_URL + "/comment?name=" + diningCourtName)
      .subscribe(
        respond => {
          this.diningCourtEmitter.next(respond);
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
