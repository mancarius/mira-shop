import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackyBarService {

  private durationInSeconds: number = 4;

  constructor(private _snackBar: MatSnackBar) { }

  public open(message: string, action = '', options: MatSnackBarConfig<any> = {}): void {
    this._snackBar.open(
      message, 
      action, 
      {
        ...options, 
        duration: this.durationInSeconds * 1000
      });
  }
}
