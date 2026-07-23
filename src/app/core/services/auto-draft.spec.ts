import { TestBed } from '@angular/core/testing';

import { AutoDraft } from './auto-draft';

describe('AutoDraft', () => {
  let service: AutoDraft;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoDraft);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
