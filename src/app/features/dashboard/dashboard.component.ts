import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { EntitlementService } from '../../core/services/entitlement.service';
import { MembersService } from '../../core/services/members.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  constructor(private membersService:MembersService,
    private entitlementService:EntitlementService,
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    if(this.entitlementService.isUserRoleAdmin()){
      this.lookupNewApplicationCount();
     }
  }

  lookupNewApplicationCount() {
    this.membersService.getRegistrationTracking()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('Data fetched in InternalComponent:', data);
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
