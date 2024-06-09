export class Patient {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  isDeleted: boolean;

  constructor(firstname: string, lastname: string, email: string, telephone: string, isDeleted: boolean) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.telephone = telephone;
    this.isDeleted = isDeleted;
  }

}
