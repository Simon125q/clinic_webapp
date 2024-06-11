import {Appointment} from "./appointment.model";

export class Patient {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  username: string;
  isDeleted: boolean;
  appointmentList: Appointment[];

  constructor(firstName: string, lastName: string, email: string,
              telephone: string, username: string, isDeleted: boolean, appointmentList: Appointment[]) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.telephone = telephone;
    this.username = username;
    this.isDeleted = isDeleted;
    this.appointmentList = appointmentList;
  }

}
