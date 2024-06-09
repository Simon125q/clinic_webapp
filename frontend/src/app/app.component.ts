import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {TokenStorageService} from "./auth/token-storage.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  private roles?: string[];
  authority?: string;

  constructor(private tokenStorage: TokenStorageService) {

  }

  ngOnInit() {
    console.log("init");
    if (this.tokenStorage.getToken()) {
      console.log(this.tokenStorage.getToken());
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          return false;
        }
        else if (role === 'ROLE_DOCTOR'){
          this.authority = 'doctor';
          return false;
        }
        this.authority = 'patient';
        return true;
      })
    }
  }
}
