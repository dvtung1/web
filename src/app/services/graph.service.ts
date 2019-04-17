import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { environment } from "src/environments/environment";
//backend api url for communication (Port 3000)
const BACKEND_URL = environment.apiUrl + "/rating";
@Injectable({
  providedIn: "root"
})
export class GraphService {
  constructor(private http: HttpClient) {}


  getAverageRatings(diningName: string){
    return this
    .http
    .get<{
      message: string;
      ratings: any;
    }
    >(BACKEND_URL + "/" + diningName + "/average");
  }

}
