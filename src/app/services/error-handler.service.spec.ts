import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ErrorHandlerService } from './error-handler.service';
import { SnackyBarService } from './snacky-bar.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SnackyBarService, useValue: {open: () => {}} }],
      imports: [NoopAnimationsModule],
    });
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
