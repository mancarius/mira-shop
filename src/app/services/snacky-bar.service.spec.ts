import { Overlay } from '@angular/cdk/overlay';
import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SnackyBarService } from './snacky-bar.service';

describe('SnackyBarService', () => {
  let service: SnackyBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MatSnackBar,
        Overlay
      ],
      imports: [NoopAnimationsModule]
    });
    service = TestBed.inject(SnackyBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#open should be called with the correct parameters', inject([MatSnackBar], (_snackBar: MatSnackBar) => {
    spyOn(_snackBar, 'open').and.stub();

    const horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    const verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    const mockMessage = 'test message';
    const mockAction = 'open';
    const mockOptions = {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition
    };
    const expectedOptions = {...mockOptions, duration: service['durationInSeconds'] * 1000};

    service.open(mockMessage, mockAction, mockOptions);

    expect(_snackBar.open).toHaveBeenCalledWith(mockMessage, mockAction, expectedOptions)
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
