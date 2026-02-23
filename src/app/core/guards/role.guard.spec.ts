import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { RoleGuard } from './role.guard';
import { EntitlementService } from '../services/entitlement.service';

describe('roleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => RoleGuard(...guardParameters));

  let mockEntitlement: Partial<EntitlementService>;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    mockEntitlement = {
      getUserRoleName: () => 'Admin',
    };

    navigateSpy = jasmine.createSpy('navigate');

    TestBed.configureTestingModule({
      providers: [
        { provide: EntitlementService, useValue: mockEntitlement },
        { provide: 'Router', useValue: { navigate: navigateSpy } },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('allows access when roles match', () => {
    const route = { data: { expectedRole: 'Admin' } } as any;
    const result = executeGuard(route, null as any);
    expect(result).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('denies access and redirects when roles do not match', () => {
    // override entitlement to return different role
    (mockEntitlement.getUserRoleName as any) = () => 'User';
    const route = { data: { expectedRole: 'Admin' } } as any;
    const result = executeGuard(route, null as any);
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalled();
  });
});
