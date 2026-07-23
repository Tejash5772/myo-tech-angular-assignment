import { TestBed } from '@angular/core/testing';

import { ProgressBar } from './progress-bar';

describe('ProgressBar', () => {
  let service: ProgressBar;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
