import {Prescription} from "./prescription.model";

export class Appointment {

  id?: number;
  date: string;
  time: string;
  prescription: Prescription;

  constructor(date: string, time: string, prescription: Prescription) {
    this.date = date;
    this.time = time;
    this.prescription = prescription;
  }
}
