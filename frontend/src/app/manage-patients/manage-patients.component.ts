import {Component, OnInit} from '@angular/core';
import {Patient} from "../models/patient.model";
import {PatientService} from "../services/patient.service";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppointmentService} from "../services/appointment.service";
import {Doctor} from "../models/doctor.model";
import {DoctorService} from "../services/doctor.service";
import {AuthService} from "../auth/auth.service";
import {SignupInfo} from "../auth/signup-info";

@Component({
  selector: 'app-manage-patients',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './manage-patients.component.html',
  styleUrl: './manage-patients.component.css'
})
export class ManagePatientsComponent implements OnInit {
  addingNew: boolean = false;
  searchPhrase?: string;
  patientList?: Patient[];
  filteredPatientList?: Patient[];
  patient?: Patient;
  displayPatient?: Patient;
  selectedPatient?: Patient;
  constructor(private patientService: PatientService,
              private appointmentService: AppointmentService,
              private doctorService: DoctorService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.getPatients();
  }

  sort(key: string): void {
    if (this.filteredPatientList == undefined) {
      this.filteredPatientList = this.patientList;
    }
    if (this.filteredPatientList == undefined) {
      return;
    }
    switch (key) {
      case "id":
        this.filteredPatientList = this.filteredPatientList.sort((a, b) => a.id && b.id ? a.id - b.id: 0);
        break;
      case "firstname":
        this.filteredPatientList = this.filteredPatientList.sort((a, b) =>
          a.firstName.localeCompare(b.firstName, undefined, {sensitivity: "base"}));
        break;
      case "lastname":
        this.filteredPatientList = this.filteredPatientList.sort((a, b) =>
          a.lastName.localeCompare(b.lastName, undefined, {sensitivity: "base"}));
        break;
      case "email":
        this.filteredPatientList = this.filteredPatientList.sort((a, b) =>
          a.email.localeCompare(b.email, undefined, {sensitivity: "base"}));
        break;
      case "telephone":
        this.filteredPatientList = this.filteredPatientList.sort((a, b) =>
          a.telephone.localeCompare(b.telephone, undefined, {sensitivity: "base"}));
        break;

    }
  }

  search(): void {
    this.filteredPatientList = [];
    if (this.patientList == undefined) {
      return;
    }
    if (this.searchPhrase == undefined) {
      this.filteredPatientList = this.patientList;
      return;
    }
    for (let doc of this.patientList) {
      if (doc.firstName.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
        this.filteredPatientList.push(doc);
      }
      else if (doc.lastName.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
        this.filteredPatientList.push(doc)
      }
      else if (doc.email.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
        this.filteredPatientList.push(doc)
      }
      else if (doc.telephone.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
        this.filteredPatientList.push(doc)
      }
      else if (doc.username.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
        this.filteredPatientList.push(doc);
      }
    }
  }

  addPatient(): void {
    this.addingNew = true;
    this.hideDetail();
  }

  displayDetail(patient: Patient): void {
    this.addingNew = false;
    this.displayPatient = patient;
    this.selectedPatient = patient;
    this.getAppointmentsDoctors();
  }

  changeSelectedToDoctor(): void {
    if (this.selectedPatient != undefined){
      this.addDoctor(this.selectedPatient.firstName, this.selectedPatient.lastName, this.selectedPatient.email,
        this.selectedPatient.telephone, this.selectedPatient.username, "", "");
      this.authService.partialUpdate(this.selectedPatient.username, "", "", ["doctor"]);
      this.delete(this.selectedPatient);
    }
    this.hideDetail();
  }

  deleteSelected(): void {
    if (this.selectedPatient!= undefined){
      this.delete(this.selectedPatient);
    }
    this.hideDetail();
  }

  updateSelected(): void {
    if (this.displayPatient != undefined && this.selectedPatient != undefined) {
      this.update(this.displayPatient.firstName, this.displayPatient.lastName, this.displayPatient.email,
        this.displayPatient.telephone, this.displayPatient.username, this.selectedPatient);
    }
    this.hideDetail();
  }

  hideDetail(): void {
    this.displayPatient = undefined;
    this.selectedPatient = undefined;
  }

  getPatients(): void {
    this.patientService.getPatients()
      .subscribe(patientList => this.patientList = patientList);
    console.log("patients");
    console.log(this.patientList);
  }

  getAppointmentsDoctors():void {
    if (this.displayPatient== undefined) {
      return;
    }
    for (let appointment of this.displayPatient.appointmentList) {
      if (appointment.id != undefined) {
        this.appointmentService.getAppointmentsDoctor(appointment.id)
          .subscribe(doctor=> appointment.doctor = doctor);
      }
    }
  }

  addDoctor(firstName: string, lastName: string, email: string,
      telephone: string, username: string, specialization: string, description: string): void {
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    telephone = telephone.trim();
    username = username.trim();
    specialization = specialization.trim();
    description = description.trim();
    this.doctorService.addDoctor({firstName, lastName, email, telephone, username, specialization, description} as Doctor)
      .subscribe({
        next: (doctor: Doctor) => {},
        error: () => {},
        complete: () => {}
      });
  }

  add(firstName: string, lastName: string, email: string,
      telephone: string, username: string, password: string): void {
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    telephone = telephone.trim();
    username = username.trim();
    password = password.trim();
    let signupInfo = new SignupInfo(username, password, "patient");
    this.authService.signUp(signupInfo).subscribe({
      next: (data) =>
      {
        console.log(data);
      }
      ,
      error: (error) => {
        console.log(error);
      },
      complete: () => {
      }
    });
    this.patientService.addPatient({firstName, lastName, email, telephone, username} as Patient)
      .subscribe({
        next: (patient: Patient) => {this.patientList?.push(patient)},
        error: () => {},
        complete: () => {
          this.authService.signUp({username, password} as SignupInfo);
          if (this.patientList != undefined) {
            this.patientService.totalItems.next(this.patientList.length);
            console.log(this.patientList.length)
          }
        }
      });
  }

  delete(patient: Patient): void {
    this.patientList = this.patientList?.filter(c => c !== patient);
    this.patientService.deletePatient(patient).subscribe(() => {
      if (this.patientList != undefined) {
        this.patientService.totalItems.next(this.patientList.length);
        console.log(this.patientList.length)
      }
    })
  }

  deleteAll(): void {
    this.patientService.deletePatients().subscribe(() => {
      if (this.patientList != undefined) {
        this.patientList.length = 0;
      }
    });
  }

  update(firstName: string, lastName: string, email: string, telephone: string,
         username: string, chosenToUpdatePatient: Patient): void {
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
            if (this.patientList != undefined) {
              let index = this.patientList?.indexOf(chosenToUpdatePatient);
              this.patientList[index] = patient;
            }
          },
          error: () => {
          },
          complete: () => {
            if (this.patientList != undefined) {
              this.patientService.totalItems.next(this.patientList.length);
              console.log(this.patientList.length);
            }
          }
        })
    }
  }
  partialUpdate(patient: Patient, firstName: string, lastName: string, email: string,
                telephone: string, username: string): void {
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    telephone = telephone.trim();
    username = username.trim();
    console.log(patient.id);
    if (patient.id != undefined) {
      this.patientService.partialUpdate(patient, firstName, lastName, email, telephone, username)
        .subscribe({
          next: (updatedPatient: Patient) => {
            if (this.patientList != undefined) {
              let index = this.patientList?.indexOf(patient);
              this.patientList[index] = updatedPatient;
            }
          },
          error: () => {
          },
          complete: () => {
            if (this.patientList != undefined) {
              this.patientService.totalItems.next(this.patientList.length);
              console.log(this.patientList.length);
            }
          }
        })
    }
  }

}

