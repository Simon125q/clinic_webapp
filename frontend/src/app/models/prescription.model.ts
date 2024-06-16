import {Appointment} from "./appointment.model";

export class Prescription {

  id?: number;
  recommendation: string;
  appointment?: Appointment;

  constructor(recommendation: string, appointment: Appointment) {
    this.recommendation = recommendation;
    this.appointment = appointment;
  }
}
