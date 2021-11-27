import { TestBed } from '@angular/core/testing';

import { CartRemoteService } from './cart-remote.service';

describe('CartRemoteService', () => {
  let service: CartRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
