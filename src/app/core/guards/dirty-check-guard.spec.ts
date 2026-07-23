import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { dirtyCheckGuard } from './dirty-check-guard';

describe('dirtyCheckGuard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => dirtyCheckGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
