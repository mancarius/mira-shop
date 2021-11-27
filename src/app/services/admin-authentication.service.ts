import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { BehaviorSubject, Subject } from 'rxjs';
import { Collections } from '../shared/enums/collections';
import { AdminSession } from '../shared/interfaces/admin-session';
import { Encrypt } from '../shared/lib/encrypt';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthenticationService {
  session$: BehaviorSubject<AdminSession | null | undefined> =
    new BehaviorSubject<AdminSession | null | undefined>(undefined);

  constructor(private _afs: AngularFirestore) {
    this._loadAndValidateLocalSessionIfExist();
  }

  private _loadAndValidateLocalSessionIfExist(): void {
    const localSessionId = this._getLocalSessionId() || '';
    if (this._isValidSessionId(localSessionId)) {
      this._getRemoteSessionById(localSessionId)
        .then((session) => {
          this.session$.next(session);
          session === null && this._deleteLocalSession();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      this.session$.next(null);
    }
  }

  private _isValidSessionId(sessionId: string): boolean {
    // looks for an alphanumeric string with a dot and without spaces
    return /^(\w)+\.([a-z0-9])+\S$/gm.test(sessionId);
  }

  /**
   *
   * @param username
   * @param password
   * @param displayName
   * @param uid
   */
  async login(
    username: string,
    password: string,
    displayName: string,
    uid: string
  ): Promise<void> {
    const encryptedPassword = await Encrypt.sha512(password);
    try {
      const response = await this._afs
        .collection(Collections.admin)
        .ref.where('username', '==', username)
        .where('password', '==', encryptedPassword)
        .get();

      const exist = response.docs.length == 1;
      if (exist) {
        const newSessionId = await this._genereateSessionId(uid);
        const newSession = {
          uid: uid,
          name: displayName,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        };
        await this._storeRemoteSession(newSession, newSessionId);
        this._storeLocalSession(newSessionId);
        this.session$.next(newSession);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async _storeRemoteSession(
    sessionData: AdminSession,
    sessionId: string
  ) {
    if (this._isValidSessionId(sessionId)) {
      try {
        await this._afs
          .collection(Collections.adminSessionLogs)
          .doc(sessionId)
          .set(sessionData);
      } catch (error) {
        console.warn(error);
        throw error;
      }
    } else {
      throw new Error('Invalid session id');
    }
  }

  /**
   *
   * @param sessionId
   * @returns
   */
  private async _getRemoteSessionById(
    sessionId: string
  ): Promise<AdminSession | null> {
    try {
      const doc = await this._afs
        .collection<AdminSession>(Collections.adminSessionLogs)
        .ref.doc(sessionId)
        .get();
      return doc?.data() ?? null;
    } catch (error: any) {
      switch (error.code) {
        case 'permission-denied':
          break;
        default:
          throw error;
      }
      return null;
    }
  }

  private _getLocalSessionId(): string | null {
    return sessionStorage.getItem('ADMIN_SESS_ID');
  }

  private async _genereateSessionId(uid: string): Promise<string> {
    const timestamp = Date.now().toString();
    return uid + '.' + (await Encrypt.sha512(timestamp));
  }

  private _storeLocalSession(sessionId: string): void {
    sessionStorage.setItem('ADMIN_SESS_ID', sessionId);
  }

  private _getLocalSession(): AdminSession | null {
    const sessionStr = sessionStorage.getItem('ADMIN_SESS_ID');
    try {
      if (sessionStr === null) throw new TypeError('');
      return JSON.parse(sessionStr);
    } catch (err) {
      return null;
    }
  }

  private _isValidString(str: string) {
    return typeof str === 'string' && /[A-Z,a-z]\w+/g.test(str);
  }

  get isAuthenticated() {
    return this._getLocalSession() !== null;
  }

  logout(): void {
    this._deleteLocalSession();
    this.session$.next(null);
  }

  private _deleteLocalSession(): void {
    sessionStorage.removeItem('ADMIN_SESS_ID');
  }
}
