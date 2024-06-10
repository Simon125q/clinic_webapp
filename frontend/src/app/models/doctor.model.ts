import {Appointment} from "./appointment.model";

export class Doctor {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  specialization: string;
  description: string;
  appointmentList: Appointment[];

  constructor(firstName: string, lastName: string, email: string,
              telephone: string, specialization: string, description: string, appointmentList: Appointment[]) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.telephone = telephone;
    this.specialization = specialization;
    this.description = description;
    this.appointmentList = appointmentList;
  }
}
