export type displayName = string | null;
export type photoURL = string | null;
export type email = string | null;
export type emailVerified = boolean;
export type id = string | null;

export interface Customer {
    displayName: displayName;
    photoURL: photoURL;
    email: email;
    emailVerified: emailVerified;
    id: id;
}
