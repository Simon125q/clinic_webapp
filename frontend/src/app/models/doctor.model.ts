export class Doctor {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  specialization: string;
  description: string;

  constructor(firstname: string, lastname: string, email: string,
              telephone: string, specialization: string, description: string) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.telephone = telephone;
    this.specialization = specialization;
    this.description = description;
  }
}
