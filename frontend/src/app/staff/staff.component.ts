import { Component } from '@angular/core';
import {DoctorDetailComponent} from "../doctor-detail/doctor-detail.component";

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
    DoctorDetailComponent
  ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent {

}
