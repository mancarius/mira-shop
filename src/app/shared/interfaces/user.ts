export type displayName = string | null;
export type photoURL = string | null;
export type email = string | null;
export type emailVerified = boolean;
export type uid = string | null;

export interface User {
    displayName: displayName;
    photoURL: photoURL;
    email: email;
    emailVerified: emailVerified;
    uid: uid;
}
