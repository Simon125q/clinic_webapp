import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginInfo} from "./login-info";
import {catchError, Observable, of, tap} from "rxjs";
import {JwtResponse} from "./jwt-response";
import {SignupInfo} from "./signup-info";
import {Patient} from "../models/patient.model";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private loginUrl = "http://localhost:8080/auth/signin";
    private signupUrl = "http://localhost:8080/auth/signup";

    constructor(private http: HttpClient) {

    }

    attemptAuth(credentials: LoginInfo): Observable<JwtResponse> {
        return this.http.post<JwtResponse>(this.loginUrl, credentials, httpOptions)
    }

    signUp(info: SignupInfo): Observable<string> {
        return this.http.post<string>(this.signupUrl, info, httpOptions);

    }

    addUser(patient: Patient): Observable<Patient> {
      return this.http.post<Patient>(this.signupUrl + "/patient", patient, httpOptions).pipe(
        tap((patientAdded: Patient) => console.log(`added patient id=${patientAdded.id}`)),
        catchError(this.handleError<Patient>('addPatient'))
      );
    }

  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }
}
