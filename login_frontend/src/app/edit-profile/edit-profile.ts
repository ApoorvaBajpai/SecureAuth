import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  imports: [FormsModule],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfileComponent implements OnInit {

  name: string = "";
  email: string = "";
  designation: string = "";
  department: string = "";

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const idToken = localStorage.getItem("id_token");
    if (!idToken) return;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${idToken}`
    });

    this.http.get<any>("http://localhost:8080/userinfo", { headers })
      .subscribe(data => {
        this.name = data.name;
        this.email = data.email;
        this.designation = data.designation;
        this.department = data.department;
      });
  }

  updateProfile() {
    const idToken = localStorage.getItem("id_token");
    if (!idToken) {
      alert("Session expired. Please login again.");
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${idToken}`
    });

    const body = {
      name: this.name,
      email: this.email,
      designation: this.designation,
      department: this.department
    };

    this.http.put("http://localhost:8080/updateProfile", body, { headers })
      .subscribe({
        next: () => {
          // Update localStorage with new values
          localStorage.setItem("name", this.name);
          localStorage.setItem("email", this.email);
          localStorage.setItem("designation", this.designation);
          localStorage.setItem("department", this.department);

          alert("Profile updated successfully!");
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error("Error updating profile:", error);
          alert("Failed to update profile. Please try again.");
        }
      });
  }
}
