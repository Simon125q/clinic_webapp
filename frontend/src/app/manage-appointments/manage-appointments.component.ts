import {Component, OnInit} from '@angular/core';
import {Appointment} from "../models/appointment.model";
import {AppointmentService} from "../services/appointment.service";
import {devOnlyGuardedExpression} from "@angular/compiler";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {of} from "rxjs";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-manage-appointments',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './manage-appointments.component.html',
  styleUrl: './manage-appointments.component.css'
})
export class ManageAppointmentsComponent implements OnInit {
  addingNew: boolean = false;
  searchPhrase?: string;
  appointmentList?: Appointment[];
  filteredAppointmentList?: Appointment[];
  appointment?: Appointment;
  displayAppointment?: Appointment;
  selectedAppointment?: Appointment;

  constructor(private appointmentService: AppointmentService) {
  }

  ngOnInit() {
    this.getAppointments();
  }

  sort(key: string): void {
    if (this.filteredAppointmentList == undefined) {
      this.filteredAppointmentList = this.appointmentList;
    }
    if (this.filteredAppointmentList == undefined) {
      return;
    }
    switch (key) {
      case "id":
        this.filteredAppointmentList = this.filteredAppointmentList.sort((a, b) => a.id && b.id ? a.id - b.id: 0);
        break;
      case "time":
        this.filteredAppointmentList = this.filteredAppointmentList.sort((a, b) =>
        a.time.localeCompare(b.time, undefined, {sensitivity: "base"}));
        break;
      case "date":
        this.filteredAppointmentList = this.filteredAppointmentList.sort((a, b) =>
          a.date.localeCompare(b.date, undefined, {sensitivity: "base"}));
        break;
    }
  }

  search(): void {
    this.filteredAppointmentList = [];
    if (this.appointmentList == undefined) {
      return;
    }
    if (this.searchPhrase == undefined) {
      this.filteredAppointmentList = this.appointmentList;
      return;
    }
    for (let appointment of this.appointmentList) {
      if (appointment.date.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
         this.filteredAppointmentList.push(appointment);
      }
      else if (appointment.time.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
        this.filteredAppointmentList.push(appointment)
      }
      else if (appointment.prescription.recommendation.toLowerCase().includes(this.searchPhrase.trim().toLowerCase())) {
        this.filteredAppointmentList.push(appointment)
      }
    }
  }

  addAppointment(): void {
    this.addingNew = true;
    this.hideDetail();
  }

  displayDetail(appointment: Appointment): void {
    this.addingNew = false;
    this.displayAppointment = appointment;
    this.selectedAppointment = appointment;
  }

  deleteSelected(): void {
    if (this.displayAppointment != undefined){
      this.delete(this.displayAppointment);
    }
    this.hideDetail();
  }

  updateSelected(): void {
    if (this.displayAppointment != undefined && this.selectedAppointment != undefined) {
      this.update(this.displayAppointment.date, this.displayAppointment.time, this.selectedAppointment);
    }
    this.hideDetail();
  }

  hideDetail(): void {
    this.displayAppointment = undefined;
    this.selectedAppointment = undefined;
  }

  getAppointments(): void {
    this.appointmentService.getAppointments()
      .subscribe(appointmentList => this.appointmentList = appointmentList);
    if (this.appointmentList != undefined) {
      for (let appointment of this.appointmentList) {
        this.filteredAppointmentList?.push(appointment);
      }
    }
    console.log("appointments");
    console.log(this.appointmentList);
  }

  add(date: string, time: string): void {
    date = date.trim();
    time = time.trim();
    this.appointmentService.addAppointment({date, time} as Appointment)
      .subscribe({
        next: (appointment: Appointment) => {this.appointmentList?.push(appointment)},
        error: () => {},
        complete: () => {
          this.filteredAppointmentList = this.appointmentList;
          if (this.appointmentList != undefined) {
            this.appointmentService.totalItems.next(this.appointmentList.length);
            console.log(this.appointmentList.length);
          }
        }
      });
  }

  delete(appointment: Appointment): void {
    this.appointmentList = this.appointmentList?.filter(c => c !== appointment);
    this.appointmentService.deleteAppointment(appointment).subscribe(() => {
      this.filteredAppointmentList = this.appointmentList;
      if (this.appointmentList != undefined) {
        this.appointmentService.totalItems.next(this.appointmentList.length);
        console.log(this.appointmentList.length)
      }
    })
  }

  deleteAll(): void {
    this.appointmentService.deleteAppointments().subscribe(() => {
      this.filteredAppointmentList = this.appointmentList;
      if (this.appointmentList != undefined) {
        this.appointmentList.length = 0;
      }
    });
  }

  update(date: string, time: string, chosenToUpdateAppointment: Appointment): void {
    let id = chosenToUpdateAppointment.id;
    date = date.trim();
    time = time.trim();
    console.log(id);
    if (id != undefined) {
      this.appointmentService.updateAppointment({date, time} as Appointment, id)
        .subscribe({
          next: (appointment: Appointment) => {
            if (this.appointmentList != undefined) {
              let index = this.appointmentList?.indexOf(chosenToUpdateAppointment);
              this.appointmentList[index] = appointment;
            }
          },
          error: () => {
          },
          complete: () => {
            this.filteredAppointmentList = this.appointmentList;
            if (this.appointmentList != undefined) {
              this.appointmentService.totalItems.next(this.appointmentList.length);
              console.log(this.appointmentList.length);
            }
          }
        })
    }
  }
  partialUpdate(appointment: Appointment, date: string, time: string): void {
    date = date.trim();
    time = time.trim();
    console.log(appointment.id);
    if (appointment.id != undefined) {
      this.appointmentService.partialUpdate(appointment, date, time)
        .subscribe({
          next: (updatedAppointment: Appointment) => {
            if (this.appointmentList != undefined) {
              let index = this.appointmentList?.indexOf(appointment);
              this.appointmentList[index] = updatedAppointment;
            }
          },
          error: () => {
          },
          complete: () => {
            this.filteredAppointmentList = this.appointmentList;
            if (this.appointmentList != undefined) {
              this.appointmentService.totalItems.next(this.appointmentList.length);
              console.log(this.appointmentList.length);
            }
          }
        })
    }
  }

  protected readonly of = of;
  protected readonly String = String;
}
