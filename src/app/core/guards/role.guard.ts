import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EntitlementService } from '../services/entitlement.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const entitlementService = inject(EntitlementService);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole']; // Get expected role from route
  const userRole = entitlementService.getUserRoleName(); // Get logged-in user role

  console.log("Loggined User Role*******************", userRole)

  if (userRole !== expectedRole) {
    router.navigate(['/dashboard']); // Redirect if role mismatch
    return false;
  }
  return true;
};
