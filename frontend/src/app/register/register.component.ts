import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {SignupInfo} from "../auth/signup-info";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {PatientService} from "../services/patient.service";
import {Patient} from "../models/patient.model";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  form: any = {};
  signupInfo?: SignupInfo;
  isSignedUp = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  ngOnInit() { }

  onSubmit() {
    console.log(this.form);

    this.signupInfo = new SignupInfo(
      this.form.username,
      this.form.password);

    this.addUser(this.form.firstname, this.form.lastname, this.form.email, this.form.telephone, this.form.username);

    this.authService.signUp(this.signupInfo).subscribe({
      next: (data) =>
      {
        console.log(data);
        this.isSignedUp = true;
        this.isSignUpFailed = false;
      }
      ,
      error: (error) => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isSignUpFailed = true;
      },
      complete: () => {
      }
    });

  }

  addUser(firstName: string, lastName: string, email: string,
      telephone: string, username: string): void {
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    telephone = telephone.trim();
    username = username.trim();
    this.authService.addUser({firstName, lastName, email, telephone, username} as Patient)
      .subscribe({
        next: (patient: Patient) => {console.log(patient)},
        error: () => {console.log("error while creating new user")},
        complete: () => {}
      });
  }
}
