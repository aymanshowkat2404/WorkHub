import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.currentUserValue;
    console.log('🛡️ AuthGuard - currentUser:', user);

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
