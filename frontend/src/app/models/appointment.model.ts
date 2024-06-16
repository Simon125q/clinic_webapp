import {Prescription} from "./prescription.model";
import {Doctor} from "./doctor.model";
import {Patient} from "./patient.model";

export class Appointment {

  id?: number;
  date: string;
  time: string;
  prescription: Prescription | undefined | null;
  doctor?: Doctor;
  patient?: Patient;

  constructor(date: string, time: string, prescription: Prescription) {
    this.date = date;
    this.time = time;
    this.prescription = prescription;
  }
}
