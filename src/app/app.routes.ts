import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';

export const routes: Routes = [

  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'address',
    loadComponent: () => import('./components/address/address-list/address-list.component').then(m => m.AddressListComponent)
  },
  {
    path: 'page-not-found',
    loadComponent: () => import('./shared/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
  },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)
  // },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'page-not-found' }
    // { path: 'login', component: LoginComponent },
    // { path: 'logout', component: LoginComponent },
    // { path: 'addresses', component: AddressListComponent },
    // { path: 'address/:id', component: AddressDetailComponent },
    // { path: 'address-form', component: AddressFormComponent },
    // { path: 'churches', component: ChurchListComponent },
    // { path: 'church/:id', component: ChurchDetailComponent },
    // { path: 'church-form', component: ChurchFormComponent },
    // { path: 'members', component: MemberListComponent },
    // { path: 'member/:id', component: MemberDetailComponent },
    // { path: 'member-form', component: MemberFormComponent },
    // { path: 'events', component: EventListComponent },
    // { path: 'event/:id', component: EventDetailComponent },
    // { path: 'event-form', component: EventFormComponent },
    // { path: 'tithes-offerings', component: TitheAndOfferingListComponent },
    // { path: 'tithe-offering/:id', component: TitheAndOfferingDetailComponent },
    // { path: 'tithe-offering-form', component: TitheAndOfferingFormComponent },
    // { path: 'login', component: LoginComponent },
    // { path: 'signup', component: SignupComponent },
    // { path: 'reset-password', component: ResetPasswordComponent },
    // { path: '', redirectTo: '/addresses', pathMatch: 'full' }, // Default route
];
