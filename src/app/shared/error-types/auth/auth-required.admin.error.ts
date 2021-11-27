import { ErrorCodes } from "../../enums/error-codes.ts";
import AuthRequiredError from "./auth-required.error";

export default class AdminAuthRequiredError extends AuthRequiredError {
    public code = ErrorCodes.admin_auth_required;

    constructor(message: string) {
        super(message);
        this.name = "Authentication required";
    }
}