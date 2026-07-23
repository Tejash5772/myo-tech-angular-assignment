import { TestBed } from '@angular/core/testing';

import { OptimisticDelete } from './optimistic-delete';

describe('OptimisticDelete', () => {
  let service: OptimisticDelete;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptimisticDelete);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
