import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MembersComponent } from './features/dashboard/members/members.component';
import { EventsComponent } from './features/dashboard/events/events.component';
import { DonationsComponent } from './features/dashboard/donations/donations.component';
import { ReportsComponent } from './features/dashboard/reports/reports.component';
import { SettingsComponent } from './features/dashboard/settings/settings.component';
import { AuthGuard } from './core/guards/auth.guard';  // ✅ FIXED IMPORT
import { ApplicationsComponent } from './features/dashboard/applications/applications.component';
import { ProfileSetupComponent } from './features/dashboard/profile-setup/profile-setup.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    {
        path: 'page-not-found',
        loadComponent: () => import('./core/components/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
      },
    {
        path: 'dashboard',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],  // ✅ Ensure AuthGuard is correctly imported
        children: [
            { path: '', component: DashboardComponent },
            { path: 'applications', component: ApplicationsComponent },
            { path: 'members', component: MembersComponent },
            { path: 'events', component: EventsComponent },
            { path: 'donations', component: DonationsComponent },
            { path: 'reports', component: ReportsComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'profile-setup', component: ProfileSetupComponent }
        ],
    },
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '**', redirectTo: 'page-not-found' }
    // { path: '**', redirectTo: '' },
];

export const routingProviders = [provideRouter(routes)];
