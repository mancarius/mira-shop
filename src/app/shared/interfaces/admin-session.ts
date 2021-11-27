import firebase from 'firebase';

export interface AdminSession {
  uid: string;
  name: string;
  createdAt: firebase.firestore.Timestamp;
}
