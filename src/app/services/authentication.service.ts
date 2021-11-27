import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public authState$: ReplaySubject<firebase.User | null> =
    new ReplaySubject<firebase.User | null>();

  constructor(private _auth: AngularFireAuth) {
    // convert Observable to BehaviorSubject
    this._auth.authState.subscribe((state: firebase.User | null) => {
      this.state = state;
    });
  }

  private set state(value: firebase.User | null) {
    if (value !== null) {
      localStorage.setItem('user_auth', JSON.stringify(value));
    } else {
      localStorage.removeItem('user_auth');
    }
    this.authState$.next(value);
  }

  private get state(): firebase.User | null {
    const userState = localStorage.getItem('user_auth');
    return typeof userState === 'string' ? JSON.parse(userState) : null;
  }

  public get isAuthenticated(): boolean {
    return this.state !== null;
  }

  public get currentUser(): firebase.User | null {
    return this.state;
  }

  public get currentUserId(): string | null {
    return this.state?.uid ?? null;
  }

  public facebookLogin(): Promise<firebase.auth.UserCredential> {
    return this._auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  public anonimousLogin(): void {
    this._auth.signInAnonymously();
  }

  public logout(): void {
    this._auth.signOut();
  }
}
