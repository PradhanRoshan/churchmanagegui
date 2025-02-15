import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { map } from "rxjs";
import { AuthService } from "../services/auth.service";

export const AuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    authService.isUserLoggedIn() ? authService.updateLoggedInValue(true) : authService.updateLoggedInValue(false);
    return authService.isLoggedIn.pipe(
        map(loggedIn => {

            console.log("*************************************")
            console.log(loggedIn)
            console.log()
            if (!loggedIn) {

                console.log("******************INSIDE*******************")
                // authService.updateLoggedInValue(false)
                router.navigate(['/login']);
                // authService.updateLoggedInValue(true)
                // authService.updateLoggedInValue(true)
                return false;
            }
            console.log("*******************OUTSIDE******************")

            return true;
        })
    );
};
