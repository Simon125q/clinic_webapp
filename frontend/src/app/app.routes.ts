import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {OfertComponent} from "./ofert/ofert.component";
import {StaffComponent} from "./staff/staff.component";
import {AboutComponent} from "./about/about.component";

export const routes: Routes = [
  {path: '', redirectTo: '/start', pathMatch: "full"},
  {path: 'start', component: HomeComponent},
  {path: 'ofert', component: OfertComponent},
  {path: 'staff', component: StaffComponent},
  {path: 'about', component: AboutComponent},
];
