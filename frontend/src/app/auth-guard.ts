import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const accessToken = localStorage.getItem("access_token");
  const idToken = localStorage.getItem("id_token");

  console.log("AUTH GUARD CHECK");
  console.log("ACCESS TOKEN:", accessToken);
  console.log("ID TOKEN:", idToken);

  if (!accessToken) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
