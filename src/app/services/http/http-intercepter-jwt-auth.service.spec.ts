import { TestBed } from '@angular/core/testing';

import { HttpIntercepterJwtAuthService } from './http-intercepter-jwt-auth.service';

describe('HttpIntercepterBasicAuthService', () => {
  let service: HttpIntercepterJwtAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpIntercepterJwtAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
