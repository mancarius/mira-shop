import { Injectable } from '@angular/core';
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

  constructor(private snaky: SnackyBarService) {}

  public add(error: Error | string): {
    and: { showMessage(msg: string): void };
  } {
    if (typeof error == 'string') {
      if (!error.length) {
        error = 'An unexpected error occurred.';
      }
      error = this._convertStringToError(error);
    }

    this._errorHistory.push({ timestamp: Date.now(), error });

    return { and: { showMessage: this._showMessage } };
  }

  private _convertStringToError(error: string): Error {
    return new Error(error);
  }

  private _showMessage(msg: string): void {
    if (msg.length > 0) {
      let lastErr = this._errorHistory.pop();
      if (lastErr) {
        lastErr.message = msg;
        this._errorHistory.push(lastErr);
      }
      this.snaky.open(msg);
    }
  }

  public get history(): { timestamp: number; error: Error }[] {
    return this._errorHistory;
  }
}
