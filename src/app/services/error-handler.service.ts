import { Injectable } from '@angular/core';
import { SnackyBarService } from './snacky-bar.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private _error: Error = new Error();

  constructor(private snaky: SnackyBarService) {}

  public add(error: Error | string): void {
    if (typeof error == 'string') {
      error = this._convertStringToError(error);
    }

    if (error instanceof Error) {
      this._showMessage();
    } else {
      this._error.message = this._error.message || 'An unexpected error occurred.';
      this._showMessage();
    }
  }

  private _convertStringToError(error: string): Error {
    return new Error(error);
  }

  private _showMessage(): void {
    if (this._error.message.length > 0) {
      this.snaky.open(this._error.message);
    }
  }
}
