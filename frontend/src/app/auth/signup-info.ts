export class SignupInfo {
    username: string;
    role: string[];
    password: string;

  constructor(username: string, password: string, role: string) {
    this.username = username;
    this.role = ['patient'];
    if (role.trim() === "doctor" || role.trim() === "admin") {
      this.role = [role];
    }
    this.password = password;
  }
}
