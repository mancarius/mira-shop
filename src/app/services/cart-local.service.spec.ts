import { TestBed } from '@angular/core/testing';

import { CartLocalService } from './cart-local.service';

describe('CartLocalService', () => {
  let service: CartLocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartLocalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
