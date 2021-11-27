import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SnackyBarService } from 'src/app/services/snacky-bar.service';
import { Product } from 'src/app/shared/interfaces/product';
import * as _ from 'lodash';
import { AdminItemService } from 'src/app/services/admin-item.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'admin-item-editor',
  templateUrl: './admin-item-editor.component.html',
  styleUrls: ['./admin-item-editor.component.scss'],
})
export class AdminItemEditorComponent implements OnInit {
  item: Partial<Product> | null = null;
  isLoading = true;
  form: FormGroup = new FormGroup({});
  failedToLoad: false | string = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<AdminItemEditorComponent>,
    private _item: AdminItemService,
    private _error: ErrorHandlerService,
    private _snaky: SnackyBarService
  ) {
    if (this._data.itemId === null) {
      this.isLoading = false;
      this.item = {};
    } else {
      this._item
        .findById(this._data.itemId)
        .then((item) => {
          this.item = item;
        })
        .catch((err) => {
          console.error(err);
          this._error.add(err);
          this.failedToLoad = err.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  ngOnInit(): void {}

  /**
   *
   *
   * @param {FormGroup} event
   * @memberof AdminItemEditorComponent
   */
  public setForm(event: FormGroup): void {
    this.form = event;
    event.errors && console.log('errors', event.errors);
  }

  /**
   *
   *
   * @return {*}  {Promise<any>}
   * @memberof AdminItemEditorComponent
   */
  public async save(): Promise<any> {
    if (
      this.form?.errors !== null ||
      this.form?.status === 'INVALID' ||
      this.form?.pristine
    ) {
      this._snaky.open('Invalid data found.');
    } else if (this._isItemDataChanged) {
      this.isLoading = true;
      const newItem = this.form.getRawValue() as Product;
      if (this.item?.id) {
        newItem.id = this.item.id;
      }
      this._item
        .save(newItem)
        .then((id: Product['id']) => {
          this.item = { ...this.form.getRawValue(), id };
          this._snaky.open('Saved succesfully!');
          this._dialogRef.close();
        })
        .catch((error) => {
          console.error(error);
          this._error
            .add(error)
            .and.showMessage('Failed to save. ' + error.message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  /**
   *
   *
   * @readonly
   * @private
   * @type {boolean}
   * @memberof AdminItemEditorComponent
   */
  private get _isItemDataChanged(): boolean {
    return !_.isEqual(this.item, this.form.getRawValue());
  }

  /**
   *
   *
   * @param {*} error
   * @memberof AdminItemEditorComponent
   */
  public catchError(error: any): void {
    this.failedToLoad = error.message;
  }
}
