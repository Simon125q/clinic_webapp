import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {Prescription} from "../models/prescription.model";
import {Injectable} from "@angular/core";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': "application/json"})
};
@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private prescriptionsUrl = "http://localhost:8080/prescriptions";

  constructor(private http: HttpClient) {
  }

  getPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(this.prescriptionsUrl);
  }

  getPrescription(id: number): Observable<Prescription> {
    const url = `${this.prescriptionsUrl}/${id}`;
    return this.http.get<Prescription>(url).pipe(
      tap(_ => this.log(`fetched prescription id=${id}`)),
      catchError(this.handleError<Prescription>(`getPrescription id=${id}`))
    );
  }

  updatePrescription(prescription: Prescription, id:number): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.prescriptionsUrl}/${id}`, prescription, httpOptions).pipe(
      tap((prescriptionUpdated: Prescription) => this.log(`updated prescription id=${prescriptionUpdated.id}`)),
      catchError(this.handleError<any>('updatePrescription'))
    );
  }

  updatePrescriptions(prescriptions: Prescription[]): Observable<Prescription[]> {
    return this.http.put<Prescription[]>(this.prescriptionsUrl, prescriptions, httpOptions).pipe(
      tap((prescriptionsUpadted: Prescription[]) => this.log(`udated prescriptions`)),
      catchError(this.handleError<any>('updatePrescriptions'))
    );
  }

  partialUpdate(prescription: Prescription, prescriptionRecommendation: string): Observable<Prescription> {
    const id = prescription.id;
    const url = `${this.prescriptionsUrl}/${id}`;
    const changes: {[id: string]: string;} = {};
    if (prescriptionRecommendation!= "") {
      changes["recommendation"] = prescriptionRecommendation;
    }

    return this.http.patch<Prescription>(url, changes, httpOptions).pipe(
      tap((prescriptionChanged: Prescription) => this.log(`changed prescription id=${prescriptionChanged.id}`)),
      catchError(this.handleError<Prescription>('partialUpdate'))
    );
  }

  addPrescription(prescription: Prescription): Observable<Prescription> {
    return this.http.post<Prescription>(this.prescriptionsUrl, prescription, httpOptions).pipe(
      tap((prescriptionAdded: Prescription) => this.log(`added prescription id=${prescriptionAdded.id}`)),
      catchError(this.handleError<Prescription>('addPrescription'))
    );
  }

  deletePrescription(prescription: Prescription | number): Observable<Prescription> {
    const id = typeof prescription === 'number' ? prescription : prescription.id;
    const url = `${this.prescriptionsUrl}/${id}`;
    return this.http.delete<Prescription>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted prescription id ${id}`)),
      catchError(this.handleError<Prescription>('deletePrescription'))
    );
  }

  deletePrescriptions(): Observable<Object | Prescription> {
    console.log("deleting prescriptions!");
    return this.http.delete(this.prescriptionsUrl, httpOptions).pipe(
      tap(() => this.log('deleted prescriptions')),
      catchError(this.handleError<Object>('deletePrescriptions'))
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
    console.log('PrescriptionService: ' + message);
  }

  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);


}
