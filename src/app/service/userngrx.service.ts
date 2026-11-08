import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable } from "@angular/core";
import { UserNGRX } from "../models/user-ngrx.modal";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export
 class UserNGRXService{


  private  http=inject(HttpClient);

    getUsers(): Observable<UserNGRX[]> {
        
  return this.http.get<UserNGRX[]>('https://jsonplaceholder.typicode.com/users');
}

   getUser(params:number): Observable<UserNGRX> {
        
  return this.http.get<UserNGRX>('https://jsonplaceholder.typicode.com/users/'+params);
}
}