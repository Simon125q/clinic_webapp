import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {Patient} from "../models/patient.model";
import {Injectable} from "@angular/core";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': "application/json"})
};
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patientsUrl = "http://localhost:8080/patients";

  constructor(private http: HttpClient) {
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.patientsUrl);
  }

  getPatient(id: number): Observable<Patient> {
    const url = `${this.patientsUrl}/${id}`;
    return this.http.get<Patient>(url).pipe(
      tap(_ => this.log(`fetched patient id=${id}`)),
      catchError(this.handleError<Patient>(`getPatient id=${id}`))
    );
  }

  updatePatient(patient: Patient, id:number): Observable<Patient> {
    return this.http.put<Patient>(`${this.patientsUrl}/${id}`, patient, httpOptions).pipe(
      tap((patientUpdated: Patient) => this.log(`updated patient id=${patientUpdated.id}`)),
      catchError(this.handleError<any>('updatePatient'))
    );
  }

  updatePatients(patients: Patient[]): Observable<Patient[]> {
    return this.http.put<Patient[]>(this.patientsUrl, patients, httpOptions).pipe(
      tap((patientsUpadted: Patient[]) => this.log(`udated patients`)),
      catchError(this.handleError<any>('updatePatients'))
    );
  }

  partialUpdate(patient: Patient, patientFirstName: string, patientLastName: string, patientEmail: string,
                patientTelephone: string): Observable<Patient> {
    const id = patient.id;
    const url = `${this.patientsUrl}/${id}`;
    const changes: {[id: string]: string;} = {};
    if (patientFirstName != "") {
      changes["firstname"] = patientFirstName;
    }
    if (patientLastName!= "") {
      changes["lastname"] = patientLastName;
    }
    if (patientEmail != "") {
      changes["email"] = patientEmail;
    }
    if (patientTelephone != "") {
      changes["telephone"] = patientTelephone;
    }

    return this.http.patch<Patient>(url, changes, httpOptions).pipe(
      tap((patientChanged: Patient) => this.log(`changed patient id=${patientChanged.id}`)),
      catchError(this.handleError<Patient>('partialUpdate'))
    );
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.patientsUrl, patient, httpOptions).pipe(
      tap((patientAdded: Patient) => this.log(`added patient id=${patientAdded.id}`)),
      catchError(this.handleError<Patient>('addPatient'))
    );
  }

  deletePatient(patient: Patient | number): Observable<Patient> {
    const id = typeof patient === 'number' ? patient : patient.id;
    const url = `${this.patientsUrl}/${id}`;
    return this.http.delete<Patient>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted patient id ${id}`)),
      catchError(this.handleError<Patient>('deletePatient'))
    );
  }

  deletePatients(): Observable<Object | Patient> {
    console.log("deleting patients!");
    return this.http.delete(this.patientsUrl, httpOptions).pipe(
      tap(() => this.log('deleted patients')),
      catchError(this.handleError<Object>('deletePatients'))
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
    console.log('PatientService: ' + message);
  }

  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);


}
