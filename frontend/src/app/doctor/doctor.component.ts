import {Component, OnInit} from '@angular/core';
import {DoctorService} from "../services/doctor.service";
import {TokenStorageService} from "../auth/token-storage.service";
import {Doctor} from "../models/doctor.model";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PrescriptionService} from "../services/prescription.service";
import {Prescription} from "../models/prescription.model";
import {AppointmentService} from "../services/appointment.service";
import {Appointment} from "../models/appointment.model";

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NgForOf
  ],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent implements OnInit {
  doctors?: Doctor[];
  doctor?: Doctor;
  displayDoctor?: Doctor;
  username?: string;
  showingAppointments: boolean = false;
  showingDoctorData: boolean = false;
  addingNewAppointment: boolean = false;

  constructor(private doctorService: DoctorService,
              private prescriptionService: PrescriptionService,
              private appointmentService: AppointmentService,
              private tokenService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.getDoctor();
  }

  getDoctorData(): void {
    this.showingAppointments = false;
    this.addingNewAppointment= false;
    this.showingDoctorData = true;
    this.getDoctorByUsername();
  }

  showAppointments(): void {
    this.showingAppointments = true;
    this.showingDoctorData = false;
    this.addingNewAppointment = false;
    this.getDoctorByUsername();
  }

  newAppointment(): void {
    this.showingAppointments = false;
    this.showingDoctorData = false;
    this.addingNewAppointment= true;
  }

  addAppointment(date: string, time: string, patientId: string) {
    let appointment: Appointment;
    this.appointmentService.addAppointment({date, time} as Appointment)
      .subscribe(app => appointment = app);
    //TODO assigning appointments to doctor and patient
  }

  addPrescription(appointmentId: number | undefined, recommendation: string): void {
    //TODO assigning prescription to appointment
    let appointment = this.doctor?.appointmentList.filter(appointment => appointment.id == appointmentId)[0];
    if (appointment != undefined && appointment.prescription.id != undefined) {
      this.prescriptionService.updatePrescription({recommendation} as Prescription, appointment.prescription.id);
    }
    else if (appointment != undefined && appointmentId != undefined) {
      this.prescriptionService.addPrescription({recommendation} as Prescription)
        .subscribe(pres => appointment.prescription = pres);

      this.appointmentService.updateAppointment(appointment, appointmentId)
    }
  }

  getDoctor(): void {
    this.doctorService.getDoctors().subscribe(doctorList => this.doctors = doctorList);
    this.username = this.tokenService.getUsername()
  }

  getDoctorByUsername(): void {
    if (this.doctors == undefined) {
      return;
    }
    for (let doc of this.doctors) {
      if (doc.username == this.username){
        this.doctor = doc;
      }
    }
    this.displayDoctor = this.doctor;
  }

  updateSelected(): void {
    if (this.displayDoctor != undefined && this.doctor != undefined) {
      this.update(this.displayDoctor.firstName, this.displayDoctor.lastName, this.displayDoctor.email,
        this.displayDoctor.telephone, this.displayDoctor.username, this.displayDoctor.specialization, this.displayDoctor.description, this.doctor);
    }
  }

  update(firstName: string, lastName: string, email: string, telephone: string, username: string,
         specialization: string, description: string, chosenToUpdateDoctor: Doctor): void {
    let id = chosenToUpdateDoctor.id;
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    telephone = telephone.trim();
    username = username.trim();
    specialization = specialization.trim();
    description = description.trim();
    console.log(id);
    if (id != undefined) {
      this.doctorService.updateDoctor({firstName, lastName, email, telephone, username, specialization, description} as Doctor, id)
        .subscribe({
          next: (doctor: Doctor) => {
            if (this.doctors != undefined) {
              let index = this.doctors?.indexOf(chosenToUpdateDoctor);
              this.doctors[index] = doctor;
            }
          },
          error: () => {
          },
          complete: () => {
            if (this.doctors != undefined) {
              this.doctorService.totalItems.next(this.doctors.length);
              console.log(this.doctors.length);
            }
          }
        })
    }
  }
}
