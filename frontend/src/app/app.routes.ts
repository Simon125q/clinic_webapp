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
import {ManageAppointmentsComponent} from "./manage-appointments/manage-appointments.component";
import {RoleGuard} from "./guards/role.guard";

export const routes: Routes = [
  {path: '', redirectTo: '/start', pathMatch: "full"},
  {path: 'start', component: HomeComponent},
  {path: 'ofert', component: OfertComponent},
  {path: 'staff', component: StaffComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'admin/doctors', component: ManageDoctorsComponent, canActivate: [RoleGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'admin/patients', component: ManagePatientsComponent, canActivate: [RoleGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'admin/appointments', component: ManageAppointmentsComponent, canActivate: [RoleGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'doctor', component: DoctorComponent, canActivate: [RoleGuard], data: {roles: ['ROLE_DOCTOR']}},
  {path: 'user', component: UserComponent, canActivate: [RoleGuard], data: {roles: ['ROLE_PATIENT']}},
  {path: 'auth/login', component: LoginComponent},
  {path: 'signup', component: RegisterComponent},
];
