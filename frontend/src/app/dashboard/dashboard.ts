import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  name = localStorage.getItem("name");
  email = localStorage.getItem("email");
  designation = localStorage.getItem("designation");
  department = localStorage.getItem("department");


  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.getUserInfo();
  }

  goToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  getUserInfo() {
    const idToken = localStorage.getItem("id_token");

    this.http.get("http://localhost:8080/userinfo", {
      headers: {
        Authorization: "Bearer " + idToken
      }
    }).subscribe((res: any) => {
      this.name = res.name;
      this.email = res.email;
      this.designation = res.designation;
      this.department = res.department;

      // Update localStorage with fresh data
      localStorage.setItem("name", res.name);
      localStorage.setItem("email", res.email);
      localStorage.setItem("designation", res.designation);
      localStorage.setItem("department", res.department);
    });
  }
  goToUsers() {
    this.router.navigate(['/users']);
  }

  logout() {
    // Clear all stored data
    localStorage.clear();

    // Navigate back to login
    this.router.navigate(['/']);
  }
}

