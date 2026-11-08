import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateUserFormDTO, User } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserApiService {

    private http = inject(HttpClient);

    private readonly apiUrl = "https://jsonplaceholder.typicode.com/users"

    getUsers(): Observable<User[]> {
        console.log(this.apiUrl,'api')
        return this.http.get<User[]>(this.apiUrl)
    }

    getUser(id: number): Observable<User> {

        return this.http.get<User>(`${this.apiUrl}/${id}`)
    }

    createUser(user: Partial<CreateUserFormDTO>): Observable<CreateUserFormDTO> {

        return this.http.post<CreateUserFormDTO>(`${this.apiUrl}`, user)

    }

    updateUser(id: number, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user)
    }

    deleteUser(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`)

    }

}