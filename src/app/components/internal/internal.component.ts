import { Component, OnInit } from '@angular/core';
import { SideNavComponent } from "./side-nav/side-nav.component";
import { RouterOutlet } from '@angular/router';
import { MemberService } from '../../services/member.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { EntitlementService } from '../../services/entitlement.service';

@Component({
  selector: 'app-internal',
  standalone: true,
  imports: [SideNavComponent,RouterOutlet],
  templateUrl: './internal.component.html',
  styleUrl: './internal.component.scss'
})
export class InternalComponent implements OnInit {

  private destroy$ = new Subject<void>();

  constructor(private memberService:MemberService,
    private entitlementService:EntitlementService,
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    if(this.entitlementService.isUserRoleAdmin()){
      this.lookupNewApplicationCount();
     }
  }

  lookupNewApplicationCount() {
    this.memberService.getRegistrationTracking()
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
