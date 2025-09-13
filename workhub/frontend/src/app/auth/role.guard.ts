import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.currentUserValue;
    const expectedRoles = route.data['roles'] as string[];

    console.log("🛡️ RoleGuard: Checking access...");
    console.log("➡️ User Roles:", user?.roles);
    console.log("➡️ Expected Roles:", expectedRoles);

    if (!user || !user.roles || !expectedRoles.some(role => user.roles.includes(role))) {
      console.warn("❌ Access Denied by RoleGuard");
      this.router.navigate(['/login']);
      return false;
    }

    console.log("✅ Access Granted by RoleGuard");
    return true;
  }
}
