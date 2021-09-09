import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuthStub } from 'src/test/AngularFireAuthStub/AngularFireAuthStub';
import { AuthenticationService } from './authentication.service';
import { SnackyBarService } from './snacky-bar.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SnackyBarService,
        { provide: AngularFireAuth, useValue: AngularFireAuthStub },
        MatSnackBar,
        Overlay
      ]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
