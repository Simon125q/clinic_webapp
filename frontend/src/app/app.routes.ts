import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {OfertComponent} from "./ofert/ofert.component";
import {StaffComponent} from "./staff/staff.component";
import {ContactComponent} from "./contact/contact.component";
import {AdminComponent} from "./admin/admin.component";
import {DoctorComponent} from "./doctor/doctor.component";
import {UserComponent} from "./user/user.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ManagePatientsComponent} from "./manage-patients/manage-patients.component";
import {ManageDoctorsComponent} from "./manage-doctors/manage-doctors.component";

export const routes: Routes = [
  {path: '', redirectTo: '/start', pathMatch: "full"},
  {path: 'start', component: HomeComponent},
  {path: 'ofert', component: OfertComponent},
  {path: 'staff', component: StaffComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'admin/doctors', component: ManageDoctorsComponent},
  {path: 'admin/patients', component: ManagePatientsComponent},
  {path: 'doctor', component: DoctorComponent},
  {path: 'user', component: UserComponent},
  {path: 'auth/login', component: LoginComponent},
  {path: 'signup', component: RegisterComponent},
];
