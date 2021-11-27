import { TestBed } from '@angular/core/testing';

import { ZipCodebaseService } from './zip-codebase.service';

describe('ZipCodebaseService', () => {
  let service: ZipCodebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZipCodebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
