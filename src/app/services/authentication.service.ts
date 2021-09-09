import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackyBarService } from './snacky-bar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public authState$: Observable<firebase.User | null>;
  private state: firebase.User | null = null;

  constructor(private auth: AngularFireAuth, private _snackBar: SnackyBarService) {
    this.authState$ = this.auth.authState;
    this.auth.authState.subscribe((state: firebase.User | null) => {
      if (state !== null) {
        this.state = state;
        this._snackBar.open('You are authenticated as ' + state.displayName);
      }
      else {
        this.state = null;
        this._snackBar.open('You have been disconnected');
      }
    });
  }

  get isAuthenticated(): boolean {
    return this.state !== null;
  }

  get currentUser(): firebase.User | null {
    return this.state;
  }

  get currentUserId(): string | null {
    return this.state?.uid ?? null;
  }

  facebookLogin(): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  anonimousLogin(): void {
    this.auth.signInAnonymously();
  }

  logout(): void {
    this.auth.signOut();
  }
}
