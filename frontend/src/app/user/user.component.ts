import {Component, OnInit} from '@angular/core';
import {PatientService} from "../services/patient.service";
import {TokenStorageService} from "../auth/token-storage.service";
import {Patient} from "../models/patient.model";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppointmentService} from "../services/appointment.service";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NgForOf
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  patients?: Patient[];
  patient?: Patient;
  displayPatient?: Patient;
  username?: string;
  showingAppointments: boolean = false;
  showingPatientData: boolean = false;

  constructor(private patientService: PatientService,
              private tokenService: TokenStorageService,
              private appointmentService: AppointmentService) {
  }

  ngOnInit(): void {
    this.getPatient();
  }

  getPatientData(): void {
    this.showingAppointments = false;
    this.showingPatientData = true;
    this.getPatientByUsername();
  }

  showAppointments(): void {
    this.showingAppointments = true;
    this.showingPatientData = false;
    this.getPatientByUsername();
    this.getAppointmentsDoctor();
  }

  newAppointment(): void {
    this.showingAppointments = false;
    this.showingPatientData = false;
  }

  getAppointmentsDoctor(): void {
    if (this.displayPatient== undefined) {
      return;
    }
    for (let appointment of this.displayPatient.appointmentList) {
      if (appointment.id != undefined) {
        this.appointmentService.getAppointmentsDoctor(appointment.id)
          .subscribe(doctor => appointment.doctor = doctor);
      }
    }
  }

  getPatient(): void {
    this.patientService.getPatients().subscribe(patientList => this.patients = patientList);
    this.username = this.tokenService.getUsername()
  }

  getPatientByUsername(): void {
    if (this.patients == undefined) {
      return;
    }
    for (let doc of this.patients) {
      if (doc.username == this.username){
        this.patient = doc;
      }
    }
    this.displayPatient = this.patient;
  }

  updateSelected(): void {
    if (this.displayPatient != undefined && this.patient != undefined) {
      this.update(this.displayPatient.firstName, this.displayPatient.lastName, this.displayPatient.email,
        this.displayPatient.telephone, this.displayPatient.username, this.patient);
    }
  }

  update(firstName: string, lastName: string, email: string, telephone: string, username: string,
         chosenToUpdatePatient: Patient): void {
    let id = chosenToUpdatePatient.id;
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    telephone = telephone.trim();
    username = username.trim();
    console.log(id);
    if (id != undefined) {
      this.patientService.updatePatient({firstName, lastName, email, telephone, username} as Patient, id)
        .subscribe({
          next: (patient: Patient) => {
            if (this.patients != undefined) {
              let index = this.patients?.indexOf(chosenToUpdatePatient);
              this.patients[index] = patient;
            }
          },
          error: () => {
          },
          complete: () => {
            if (this.patients != undefined) {
              this.patientService.totalItems.next(this.patients.length);
              console.log(this.patients.length);
            }
          }
        })
    }
  }
}
