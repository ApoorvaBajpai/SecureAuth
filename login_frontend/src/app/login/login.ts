import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  id: string = "";
  password: string = "";
  errorMessage: string = "";

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    console.log("LOGIN BUTTON CLICKED");
    const body = {
      id: this.id,
      password: this.password
    };

    this.http.post("http://localhost:8080/login", body).subscribe({
      next: (res: any) => {
        const accessToken = res.access_token;
        const idToken = res.id_token;

        const decoded: any = jwtDecode(idToken);

        console.log("Decoded Token:", decoded);

        // Store tokens
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("id_token", idToken);

        // Store user info
        localStorage.setItem("name", decoded.name);
        localStorage.setItem("email", decoded.email);
        localStorage.setItem("userId", decoded.sub);
        localStorage.setItem("designation", decoded.designation);
        localStorage.setItem("department", decoded.department);


        this.errorMessage = "";

        alert("Login successful!");
        this.router.navigate(['/dashboard']);

      },

      error: (err) => {
        this.errorMessage = "Invalid ID or Password";
      }
    });
  }
}
