import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/dining";

@Injectable({
  providedIn: "root"
})
export class DiningService {
  constructor(private http: HttpClient) {}

  getComment(diningCourtName: string) {
    this.http
      .get<{ message: string }>(
        BACKEND_URL + "/comment?name=" + diningCourtName
      )
      .subscribe(
        respond => {
          console.log(respond);
        },
        err => {
          console.log(err);
        }
      );
  }
}
