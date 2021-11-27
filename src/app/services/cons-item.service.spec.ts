import { TestBed } from '@angular/core/testing';

import { ConsItemService } from './cons-item.service';

describe('ConsItemService', () => {
  let service: ConsItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
