// app.routes.ts

import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Not found page (lazy)
  {
    path: 'page-not-found',
    loadComponent: () =>
      import('./core/components/page-not-found/page-not-found.component')
        .then(m => m.PageNotFoundComponent),
  },

  // Protected area
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Dashboard home
      { path: '', component: DashboardComponent },

      // ✅ Admin-only routes (guard once)
      {
        path: '',
        canActivateChild: [RoleGuard],
        data: { expectedRole: 'Admin' },
        children: [
          {
            path: 'applications',
            loadComponent: () =>
              import('./features/dashboard/applications/applications.component')
                .then(m => m.ApplicationsComponent),
          },
          {
            path: 'applications/:id',
            loadComponent: () =>
              import('./features/dashboard/applications/application-details/application-details.component')
                .then(m => m.ApplicationDetailsComponent),
          },
          {
            path: 'members',
            loadComponent: () =>
              import('./features/dashboard/members/members.component')
                .then(m => m.MembersComponent),
          },
        
          {
            path: 'reports',
            loadComponent: () =>
              import('./features/dashboard/reports/reports.component')
                .then(m => m.ReportsComponent),
          },
        ],
      },

      // Authenticated (non-admin) routes
       {
            path: 'donations',
            loadComponent: () =>
              import('./features/dashboard/donations/donations.component')
                .then(m => m.DonationsComponent),
    },
      {
        path: 'events',
        loadComponent: () =>
          import('./features/dashboard/events/events.component')
            .then(m => m.EventsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/dashboard/settings/settings.component')
            .then(m => m.SettingsComponent),
      },
      {
        path: 'profile-setup',
        loadComponent: () =>
          import('./features/dashboard/profile-setup/profile-setup.component')
            .then(m => m.ProfileSetupComponent),
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'page-not-found' },
];

export const routingProviders = [provideRouter(routes)];



// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { Routes } from '@angular/router';
// import { provideRouter } from '@angular/router';

// import { LandingPageComponent } from './pages/landing-page/landing-page.component';
// import { LoginComponent } from './features/auth/login/login.component';
// import { SignupComponent } from './features/auth/signup/signup.component';
// import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
// import { DashboardComponent } from './features/dashboard/dashboard.component';
// import { MembersComponent } from './features/dashboard/members/members.component';
// import { EventsComponent } from './features/dashboard/events/events.component';
// import { DonationsComponent } from './features/dashboard/donations/donations.component';
// import { ReportsComponent } from './features/dashboard/reports/reports.component';
// import { SettingsComponent } from './features/dashboard/settings/settings.component';
// import { AuthGuard } from './core/guards/auth.guard';  // ✅ FIXED IMPORT
// import { ApplicationsComponent } from './features/dashboard/applications/applications.component';
// import { ProfileSetupComponent } from './features/dashboard/profile-setup/profile-setup.component';
// import { RoleGuard } from './core/guards/role.guard';

// export const routes: Routes = [
//     { path: '', component: LandingPageComponent },
//     { path: 'login', component: LoginComponent },
//     { path: 'signup', component: SignupComponent },
//     {
//         path: 'page-not-found',
//         loadComponent: () => import('./core/components/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
//       },
//     {
//         path: 'dashboard',
//         component: MainLayoutComponent,
//         canActivate: [AuthGuard],  // ✅ Ensure AuthGuard is correctly imported
//         children: [
//             { path: '', component: DashboardComponent },
//             { 
//                 path: 'applications', 
//                 component: ApplicationsComponent, 
//                 canActivate: [RoleGuard], 
//                 data: { expectedRole: 'Admin' }
//             },
//             {
//                 path: 'application-details/:id',
//                 canActivate: [RoleGuard],
//                 data: { expectedRole: 'Admin' },    
//                 loadComponent: () => import('./features/dashboard/applications/application-details/application-details.component').then(m => m.ApplicationDetailsComponent)
//             },
//             { 
//                 path: 'members', 
//                 component: MembersComponent, 
//                 canActivate: [RoleGuard], 
//                 data: { expectedRole: 'Admin' }
//             },
//             // { path: 'applications', component: ApplicationsComponent },
//             // { path: 'members', component: MembersComponent },
//             { path: 'events', component: EventsComponent },
//             { path: 'donations', component: DonationsComponent },
//             { path: 'reports', component: ReportsComponent },
//             { path: 'settings', component: SettingsComponent },
//             { path: 'profile-setup', component: ProfileSetupComponent }
//         ],
//     },
//     { path: '', redirectTo: '', pathMatch: 'full' },
//     { path: '**', redirectTo: 'page-not-found' }
//     // { path: '**', redirectTo: '' },
// ];

// export const routingProviders = [provideRouter(routes)];
