<!--
  Auto-generated guidance for AI coding agents working on this repository.
  Keep this short (20-50 lines). Update when architectural or workflow changes occur.
-->

# Copilot / AI Agent Instructions — churchmanagegui

Overview

- This is an Angular 19 single-page app (standalone components) bootstrapped from `src/main.ts` with `bootstrapApplication`. App-wide providers live in `src/app/app.config.ts`.
- Routes are defined in `src/app/app.routes.ts`. `MainLayoutComponent` is the parent for authenticated dashboard routes.

Key patterns

- Standalone components are used (look at `src/app/app.component.ts`). Use `imports` in component metadata rather than NgModule wiring.
- HTTP uses the Angular `provideHttpClient` and a global interceptor `src/app/core/interceptors/jwtInterceptor.ts` that attaches JWT from sessionStorage (`'jwtToken'`).
- Authentication and role checks rely on sessionStorage keys: `authenticaterUser`, `jwtToken`, `userDetials`, `newApplicationCount`. See `src/app/core/services/auth.service.ts` and `src/app/core/services/entitlement.service.ts` for exact access patterns.

Developer workflows

- Start dev server: `npm start` (runs `ng serve --open`). See `package.json` scripts.
- Build production: `npm run build:prod` or `ng build --configuration production`.
- Tests: `npm test` (Karma/Jasmine). Linting via `npm run lint` (angular-eslint).
- To debug HTTP issues, inspect `jwtInterceptor` logs and check `API_URL` in `src/environments/environment.ts` (dev) and `environment.prod.ts` (prod).

Conventions & gotchas

- Session storage is the single source of truth for user info. Functions like `EntitlementService.getUserRoleName()` parse `sessionStorage.getItem('userDetials')`.
- Guards are lightweight CanActivate functions (see `core/guards`). They inject services directly using `inject()` rather than constructor DI.
- Interceptor expects backend error body to be JSON with `status` and `error` fields; some parsing assumes stringified JSON — preserve the existing error handling until backend changes.
- Routes sometimes use `loadComponent` for lazy standalone components (see `page-not-found` route). Keep lazy imports consistent.

When editing code

- Preserve standalone component style. When adding route guards/providers, prefer `provideRouter(routes)` in `app.config.ts` so the app bootstrap stays minimal.
- When changing auth flows, update `auth.service.ts`, `jwtInterceptor.ts`, and places writing to sessionStorage (`login`, `logout`, `setUserDetailsToSubject`) together.
- Prefer editing `src/environments/*` for API URLs; do not hardcode backend URLs elsewhere.

Where to look first (examples)

- App bootstrap and providers: `src/main.ts`, `src/app/app.config.ts`
- Routing: `src/app/app.routes.ts`
- Auth: `src/app/core/services/auth.service.ts`, `src/app/core/interceptors/jwtInterceptor.ts`, `src/app/core/guards/auth.guard.ts`
- Role logic: `src/app/core/services/entitlement.service.ts`, `src/app/core/guards/role.guard.ts`

Notes for reviewers

- Keep changes small and run `npm start` then exercise login/dashboard to verify sessionStorage-driven flows.
- Unit tests exist under `src/**/*.spec.ts`; run `npm test` before opening PRs that change logic.

If anything here is stale, please update this file with the minimal, discoverable change.
