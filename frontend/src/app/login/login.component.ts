import {Component, OnInit} from '@angular/core';
import {LoginInfo} from "../auth/login-info";
import {AuthService} from "../auth/auth.service";
import {TokenStorageService} from "../auth/token-storage.service";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  form: any = {};
  token?: string;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  private loginInfo?: LoginInfo;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit() {
    if (this.tokenStorage.getToken() != null && this.tokenStorage.getToken() != '{}') {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getAuthorities();
    }
  }

  onSubmit() {
    console.log(this.form);

    this.loginInfo = new LoginInfo(this.form.username, this.form.password);

    this.authService.attemptAuth(this.loginInfo).subscribe({
      next:(data)  =>
      {
        this.tokenStorage.saveToken(data.accessToken || '{}');
        this.tokenStorage.saveUsername(data.username || '{}');
        this.tokenStorage.saveAuthorities(data.authorities || []);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.token = this.tokenStorage.getToken();
        this.roles = this.tokenStorage.getAuthorities();
        this.reloadPage();
      }
      ,
      error: (error) => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage() {
    window.location.reload();
  }

}
