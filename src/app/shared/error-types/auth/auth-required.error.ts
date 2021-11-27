import { ErrorCodes } from "../../enums/error-codes.ts";
import AuthError from "./auth.error";

export default class AuthRequiredError extends AuthError {
    public code = ErrorCodes.user_auth_required;

    constructor(message?: string) {
        super(message);
        this.name = "Authentication required";
    }
}