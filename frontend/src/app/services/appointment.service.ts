import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {Appointment} from "../models/appointment.model";
import {Doctor} from "../models/doctor.model";
import {Patient} from "../models/patient.model";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': "application/json"})
};
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsUrl = "http://localhost:8080/appointments";

  constructor(private http: HttpClient) {
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.appointmentsUrl);
  }

  getAppointment(id: number): Observable<Appointment> {
    const url = `${this.appointmentsUrl}/${id}`;
    return this.http.get<Appointment>(url).pipe(
      tap(_ => this.log(`fetched appointment id=${id}`)),
      catchError(this.handleError<Appointment>(`getAppointment id=${id}`))
    );
  }

  getAppointmentsDoctor(id: number): Observable<Doctor> {
    const url = `${this.appointmentsUrl}/d${id}`;
    return this.http.get<Doctor>(url).pipe(
      tap(_ => this.log(`fetched doctor for appointment id=${id}`)),
      catchError(this.handleError<Doctor>(`getAppointmentsDoctor id=${id}`))
    );
  }

  getAppointmentsPatient(id: number): Observable<Patient> {
    const url = `${this.appointmentsUrl}/p${id}`;
    return this.http.get<Patient>(url).pipe(
      tap(_ => this.log(`fetched patient for appointment id=${id}`)),
      catchError(this.handleError<Patient>(`getAppointmentsPatient id=${id}`))
    );
  }

  updateAppointment(appointment: Appointment, id:number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.appointmentsUrl}/${id}`, appointment, httpOptions).pipe(
      tap((appointmentUpdated: Appointment) => this.log(`updated appointment id=${appointmentUpdated.id}`)),
      catchError(this.handleError<any>('updateAppointment'))
    );
  }

  updateAppointments(appointments: Appointment[]): Observable<Appointment[]> {
    return this.http.put<Appointment[]>(this.appointmentsUrl, appointments, httpOptions).pipe(
      tap((appointmentsUpadted: Appointment[]) => this.log(`udated appointments`)),
      catchError(this.handleError<any>('updateAppointments'))
    );
  }

  partialUpdate(appointment: Appointment, appointmentDate: string, appointmentTime: string): Observable<Appointment> {
    const id = appointment.id;
    const url = `${this.appointmentsUrl}/${id}`;
    const changes: {[id: string]: string | Appointment[];} = {};
    if (appointmentDate!= "") {
      changes["date"] = appointmentDate;
    }
    if (appointmentTime!= "") {
      changes["time"] = appointmentTime;
    }

    return this.http.patch<Appointment>(url, changes, httpOptions).pipe(
      tap((appointmentChanged: Appointment) => this.log(`changed appointment id=${appointmentChanged.id}`)),
      catchError(this.handleError<Appointment>('partialUpdate'))
    );
  }

  addAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.appointmentsUrl, appointment, httpOptions).pipe(
      tap((appointmentAdded: Appointment) => this.log(`added appointment id=${appointmentAdded.id}`)),
      catchError(this.handleError<Appointment>('addAppointment'))
    );
  }

  deleteAppointment(appointment: Appointment | number): Observable<Appointment> {
    const id = typeof appointment === 'number' ? appointment : appointment.id;
    const url = `${this.appointmentsUrl}/${id}`;
    return this.http.delete<Appointment>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted appointment id ${id}`)),
      catchError(this.handleError<Appointment>('deleteAppointment'))
    );
  }

  deleteAppointments(): Observable<Object | Appointment> {
    console.log("deleting appointments!");
    return this.http.delete(this.appointmentsUrl, httpOptions).pipe(
      tap(() => this.log('deleted appointments')),
      catchError(this.handleError<Object>('deleteAppointments'))
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
    console.log('AppointmentService: ' + message);
  }

  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);

}
