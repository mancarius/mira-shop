import { Injectable } from '@angular/core';
import AuthRequiredError from '../shared/error-types/auth/auth-required.error';
import { SnackyBarService } from './snacky-bar.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private _errorHistory: {
    timestamp: number;
    message?: string;
    error: Error;
  }[] = [];

  constructor(private _snaky: SnackyBarService) {}

  public add(error: Error | string): {
    and: { showMessage(msg: string): void };
  } {
    if (typeof error == 'string') {
      error = this._convertStringToError(
        error.length ? error : 'An unexpected error occurred.'
      );
    }

    this._errorHistory.push({ timestamp: Date.now(), error });

    return { and: { showMessage: this._showMessage.bind(this) } };
  }

  private _convertStringToError(error: string): Error {
    return new Error(error);
  }

  private _showMessage(msg: string): void {
    !msg.length && (msg = 'An unexpected error occurred.');
    this._snaky.open(msg);
    this._addShowedMessageToLastError(msg);
  }

  public get history(): { timestamp: number; error: Error }[] {
    return this._errorHistory;
  }

  private _addShowedMessageToLastError(msg: string): void {
    let lastErr = this._errorHistory.pop();
    if (lastErr) {
      lastErr.message = msg;
      this._errorHistory.push(lastErr);
    }
  }

  public get auth() {
    return {
      required: AuthRequiredError,
    }
  }
}
