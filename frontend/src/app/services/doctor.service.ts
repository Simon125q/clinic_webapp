import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {Doctor} from "../models/doctor.model";
import {Injectable} from "@angular/core";
import {Appointment} from "../models/appointment.model";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': "application/json"})
};
@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctorsUrl = "http://localhost:8080/doctors";

  constructor(private http: HttpClient) {
  }



  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.doctorsUrl);
  }

  getDoctor(id: number): Observable<Doctor> {
    const url = `${this.doctorsUrl}/${id}`;
    return this.http.get<Doctor>(url).pipe(
      tap(_ => this.log(`fetched doctor id=${id}`)),
      catchError(this.handleError<Doctor>(`getDoctor id=${id}`))
    );
  }

  updateDoctor(doctor: Doctor, id:number): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.doctorsUrl}/${id}`, doctor, httpOptions).pipe(
      tap((doctorUpdated: Doctor) => this.log(`updated doctor id=${doctorUpdated.id}`)),
      catchError(this.handleError<any>('updateDoctor'))
    );
  }

  updateDoctors(doctors: Doctor[]): Observable<Doctor[]> {
    return this.http.put<Doctor[]>(this.doctorsUrl, doctors, httpOptions).pipe(
      tap((doctorsUpadted: Doctor[]) => this.log(`udated doctors`)),
      catchError(this.handleError<any>('updateDoctors'))
    );
  }

  partialUpdate(doctor: Doctor, doctorFirstName: string, doctorLastName: string, doctorEmail: string,
                doctorTelephone: string, doctorUsername: string, doctorSpecialization: string, doctorDescription: string): Observable<Doctor> {
    const id = doctor.id;
    const url = `${this.doctorsUrl}/${id}`;
    const changes: {[id: string]: string | Appointment[];} = {};
    if (doctorFirstName != "") {
      changes["firstname"] = doctorFirstName;
    }
    if (doctorLastName!= "") {
      changes["lastname"] = doctorLastName;
    }
    if (doctorEmail != "") {
      changes["email"] = doctorEmail;
    }
    if (doctorTelephone != "") {
      changes["telephone"] = doctorTelephone;
    }
    if (doctorUsername != "") {
      changes["username"] = doctorUsername;
    }
    if (doctorSpecialization != "") {
      changes["specialization"] = doctorSpecialization;
    }
    if (doctorDescription != "") {
      changes["description"] = doctorDescription;
    }

    return this.http.patch<Doctor>(url, changes, httpOptions).pipe(
      tap((doctorChanged: Doctor) => this.log(`changed doctor id=${doctorChanged.id}`)),
      catchError(this.handleError<Doctor>('partialUpdate'))
    );
  }

  addDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.doctorsUrl, doctor, httpOptions).pipe(
      tap((doctorAdded: Doctor) => this.log(`added doctor id=${doctorAdded.id}`)),
      catchError(this.handleError<Doctor>('addDoctor'))
    );
  }

  deleteDoctor(doctor: Doctor | number): Observable<Doctor> {
    const id = typeof doctor === 'number' ? doctor : doctor.id;
    const url = `${this.doctorsUrl}/${id}`;
    return this.http.delete<Doctor>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted doctor id ${id}`)),
      catchError(this.handleError<Doctor>('deleteDoctor'))
    );
  }

  deleteDoctors(): Observable<Object | Doctor> {
    console.log("deleting doctors!");
    return this.http.delete(this.doctorsUrl, httpOptions).pipe(
      tap(() => this.log('deleted doctors')),
      catchError(this.handleError<Object>('deleteDoctors'))
    );
  }


  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

  private log(message: string) {
    console.log('DoctorService: ' + message);
  }

  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);


}
