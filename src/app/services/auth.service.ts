import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDet } from '../models/user.model';

/* ================= LOGIN SERVICE ================= */

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private baseUrl = 'http://localhost:8080/login';

    constructor(private http: HttpClient) { }

    validatePhone(phone: string): Observable<any> {
        return this.http.post(
            this.baseUrl + '/validate-phone',
            phone
        );
    }

}


/* ================= REGISTER SERVICE ================= */

@Injectable({
    providedIn: 'root'
})
export class RegisterService {

    private baseUrl = 'http://localhost:8080/register';

    constructor(private http: HttpClient) { }

    registerUser(user: UserDet): Observable<UserDet> {
        return this.http.post<UserDet>(this.baseUrl + '/add', user);
    }
}

