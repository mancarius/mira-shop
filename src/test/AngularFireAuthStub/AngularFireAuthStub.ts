import { of } from "rxjs";

export const AngularFireAuthStub = {

    signInWithPopup: (someString: string) => Promise.resolve(''),

    signInAnonymously: (someString: string) => Promise.resolve(''),

    signOut: (someString: string) => Promise.resolve(''),

    authState: of(''),
}