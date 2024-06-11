import {Component, OnInit} from '@angular/core';
import {Doctor} from "../models/doctor.model";
import {DoctorService} from "../services/doctor.service";
import {devOnlyGuardedExpression} from "@angular/compiler";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {of} from "rxjs";
import {FormsModule} from "@angular/forms";
import {Appointment} from "../models/appointment.model";
import {AppointmentService} from "../services/appointment.service";

@Component({
  selector: 'app-manage-doctors',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './manage-doctors.component.html',
  styleUrl: './manage-doctors.component.css'
})
export class ManageDoctorsComponent implements OnInit {
  addingNew: boolean = false;
  searchPhrase?: string;
  doctorList?: Doctor[];
  filteredDoctorList?: Doctor[];
  doctor?: Doctor;
  displayDoctor?: Doctor;
  selectedDoctor?: Doctor;

  constructor(private doctorService: DoctorService) {
  }

  ngOnInit() {
    this.getDoctors();
  }

  sort(key: string): void {
    if (this.filteredDoctorList == undefined) {
      this.filteredDoctorList = this.doctorList;
    }
    if (this.filteredDoctorList == undefined) {
      return;
    }
    switch (key) {
      case "id":
        this.filteredDoctorList = this.filteredDoctorList.sort((a, b) => a.id && b.id ? a.id - b.id: 0);
        break;
      case "firstname":
        this.filteredDoctorList = this.filteredDoctorList.sort((a, b) =>
        a.firstName.localeCompare(b.firstName, undefined, {sensitivity: "base"}));
        break;
      case "lastname":
        this.filteredDoctorList = this.filteredDoctorList.sort((a, b) =>
          a.lastName.localeCompare(b.lastName, undefined, {sensitivity: "base"}));
        break;
      case "email":
        this.filteredDoctorList = this.filteredDoctorList.sort((a, b) =>
          a.email.localeCompare(b.email, undefined, {sensitivity: "base"}));
        break;
      case "telephone":
        this.filteredDoctorList = this.filteredDoctorList.sort((a, b) =>
          a.telephone.localeCompare(b.telephone, undefined, {sensitivity: "base"}));
        break;
      case "specialization":
        this.filteredDoctorList = this.filteredDoctorList.sort((a, b) =>
          a.specialization.localeCompare(b.specialization, undefined, {sensitivity: "base"}));
        break;
    }
  }

  search(): void {
    this.filteredDoctorList = [];
    if (this.doctorList == undefined) {
      return;
    }
    if (this.searchPhrase == undefined) {
      this.filteredDoctorList = this.doctorList;
      return;
    }
    for (let doc of this.doctorList) {
      if (doc.firstName.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
         this.filteredDoctorList.push(doc);
      }
      else if (doc.lastName.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
        this.filteredDoctorList.push(doc)
      }
      else if (doc.email.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
        this.filteredDoctorList.push(doc)
      }
      else if (doc.telephone.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
        this.filteredDoctorList.push(doc)
      }
      else if (doc.specialization.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
        this.filteredDoctorList.push(doc)
      }
      else if (doc.description.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
        this.filteredDoctorList.push(doc)
      }
    }
  }

  addDoctor(): void {
    this.addingNew = true;
    this.hideDetail();
  }

  displayDetail(doctor: Doctor): void {
    this.addingNew = false;
    this.displayDoctor = doctor;
    this.selectedDoctor = doctor;
  }

  deleteSelected(): void {
    if (this.displayDoctor != undefined){
      this.delete(this.displayDoctor);
    }
    this.hideDetail();
  }

  updateSelected(): void {
    if (this.displayDoctor != undefined && this.selectedDoctor != undefined) {
      this.update(this.displayDoctor.firstName, this.displayDoctor.lastName, this.displayDoctor.email,
        this.displayDoctor.telephone, this.displayDoctor.specialization, this.displayDoctor.description, this.selectedDoctor);
    }
    this.hideDetail();
  }

  hideDetail(): void {
    this.displayDoctor = undefined;
    this.selectedDoctor = undefined;
  }

  getDoctors(): void {
    this.doctorService.getDoctors()
      .subscribe(doctorList => this.doctorList = doctorList);
    if (this.doctorList != undefined) {
      for (let doc of this.doctorList) {
        this.filteredDoctorList?.push(doc);
      }
    }
    console.log("doctors");
    console.log(this.doctorList);
  }

  add(firstName: string, lastName: string, email: string,
      telephone: string, specialization: string, description: string): void {
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    telephone = telephone.trim();
    specialization = specialization.trim();
    description = description.trim();
    this.doctorService.addDoctor({firstName, lastName, email, telephone, specialization, description} as Doctor)
      .subscribe({
        next: (doctor: Doctor) => {this.doctorList?.push(doctor)},
        error: () => {},
        complete: () => {
          this.filteredDoctorList = this.doctorList;
          if (this.doctorList != undefined) {
            this.doctorService.totalItems.next(this.doctorList.length);
            console.log(this.doctorList.length);
          }
        }
      });
  }

  delete(doctor: Doctor): void {
    this.doctorList = this.doctorList?.filter(c => c !== doctor);
    this.doctorService.deleteDoctor(doctor).subscribe(() => {
      this.filteredDoctorList = this.doctorList;
      if (this.doctorList != undefined) {
        this.doctorService.totalItems.next(this.doctorList.length);
        console.log(this.doctorList.length)
      }
    })
  }

  deleteAll(): void {
    this.doctorService.deleteDoctors().subscribe(() => {
      this.filteredDoctorList = this.doctorList;
      if (this.doctorList != undefined) {
        this.doctorList.length = 0;
      }
    });
  }

  update(firstName: string, lastName: string, email: string, telephone: string,
         specialization: string, description: string, chosenToUpdateDoctor: Doctor): void {
    let id = chosenToUpdateDoctor.id;
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    telephone = telephone.trim();
    specialization = specialization.trim();
    description = description.trim();
    console.log(id);
    if (id != undefined) {
      this.doctorService.updateDoctor({firstName, lastName, email, telephone, specialization, description} as Doctor, id)
        .subscribe({
          next: (doctor: Doctor) => {
            if (this.doctorList != undefined) {
              let index = this.doctorList?.indexOf(chosenToUpdateDoctor);
              this.doctorList[index] = doctor;
            }
          },
          error: () => {
          },
          complete: () => {
            this.filteredDoctorList = this.doctorList;
            if (this.doctorList != undefined) {
              this.doctorService.totalItems.next(this.doctorList.length);
              console.log(this.doctorList.length);
            }
          }
        })
    }
  }
  partialUpdate(doctor: Doctor, firstName: string, lastName: string, email: string,
                telephone: string, specialization: string, description: string): void {
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    telephone = telephone.trim();
    specialization = specialization.trim();
    description = description.trim();
    console.log(doctor.id);
    if (doctor.id != undefined) {
      this.doctorService.partialUpdate(doctor, firstName, lastName, email, telephone, specialization, description)
        .subscribe({
          next: (updatedDoctor: Doctor) => {
            if (this.doctorList != undefined) {
              let index = this.doctorList?.indexOf(doctor);
              this.doctorList[index] = updatedDoctor;
            }
          },
          error: () => {
          },
          complete: () => {
            this.filteredDoctorList = this.doctorList;
            if (this.doctorList != undefined) {
              this.doctorService.totalItems.next(this.doctorList.length);
              console.log(this.doctorList.length);
            }
          }
        })
    }
  }

  protected readonly of = of;
  protected readonly String = String;
}
