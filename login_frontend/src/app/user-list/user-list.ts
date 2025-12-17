import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    console.log('loadUsers() called');
    const idToken = localStorage.getItem('id_token');
    console.log('ID TOKEN:', idToken);

    if (!idToken) {
      console.warn("No ID token found. Please login.");
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${idToken}`,
    });

    this.http
      .get<any>(
        `http://localhost:8080/users?page=${this.page}&size=${this.size}`,
        { headers }
      )
      .subscribe((response) => {
        console.log('RAW RESPONSE:', response);
        console.log('CONTENT:', response.content);
        this.users = response.content;
        console.log('USERS AFTER ASSIGN:', this.users);
        this.totalPages = response.totalPages;
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
