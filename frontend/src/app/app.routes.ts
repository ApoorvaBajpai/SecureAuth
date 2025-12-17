import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './auth-guard';
import { EditProfileComponent } from './edit-profile/edit-profile';
import { UserListComponent } from './user-list/user-list';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'users', component: UserListComponent, canActivate: [authGuard] }
];
