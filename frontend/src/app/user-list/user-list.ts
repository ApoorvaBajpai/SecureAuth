import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
})
export class UserListComponent implements OnInit {

  users: any[] = [];
  rawResponse: any = "No data yet..."; // Debugging field
  page = 0;
  size = 3;

  totalPages = 1;

  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    console.log('UserListComponent CREATED');
  }



  ngOnInit(): void {
    console.log('UserListComponent ngOnInit');
    this.loadUsers();
  }



  loadUsers() {
    this.errorMessage = '';
    console.log('loadUsers() called');
    const token = localStorage.getItem('id_token');
    console.log('ID TOKEN:', token);

    if (!token) {
      this.errorMessage = 'No authentication token found. Please login.';
      console.warn("No ID token found. Please login.");
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(
        `http://localhost:8080/users?page=${this.page}&size=${this.size}`,
        { headers }
      )
      .subscribe({
        next: (response) => {
          console.log('RAW RESPONSE:', response);

          if (Array.isArray(response)) {
            this.users = response;
            this.totalPages = 1;

          } else if (response && response.content) {
            this.users = response.content;
            this.totalPages = response.totalPages || 0;
            this.cdr.detectChanges(); // 👈 ADD THIS LINE
          } else {
            this.users = [];
          }
          console.log('USERS AFTER ASSIGN:', this.users);
        },
        error: (error) => {
          console.error('API Error:', error);
          this.errorMessage = `Failed to load users. Status: ${error.status}`;
          if (error.status === 0) {
            this.errorMessage = 'Unable to connect to server. Is the backend running?';
          } else if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Unauthorized. Please login again.';
          }
        }
      });

  }

  nextPage() {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadUsers();
    }
  }
}
