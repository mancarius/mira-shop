import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogTemplateComponent } from 'src/app/components/dialog-template/dialog-template.component';
import { AdminItemService } from 'src/app/services/admin-item.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SnackyBarService } from 'src/app/services/snacky-bar.service';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'admin-items-delete-button',
  templateUrl: './admin-items-delete-button.component.html',
  styleUrls: ['./admin-items-delete-button.component.scss'],
})
export class AdminItemsDeleteButtonComponent implements OnInit, OnChanges {
  @Input() toDelete: Product[] = [];

  disabled = true;

  constructor(
    private _item: AdminItemService,
    private _snacky: SnackyBarService,
    private _dialog: MatDialog,
    private _error: ErrorHandlerService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.toDelete) {
      this.disabled = !changes.toDelete.currentValue.length;
    }
  }

  ngOnInit(): void {}

  private _delete() {
    const itemsLength = this.toDelete.length;
    if (!itemsLength) {
      this._snacky.open('No items to delete');
      return;
    }

    const itemsIdList = this._getItemsId(this.toDelete);

    this._item.delete(itemsIdList).then(() => {
      this._snacky.open(itemsLength + ' item'+ (itemsLength > 1 ? 's' : '') + ' deleted');
    }).catch(error => {
      console.error(error);
      this._error
        .add(error)
        .and.showMessage('I was unable to complete the required operation');
    });
  }

  openConfirmDialog() {
    const dialogRef = this._dialog.open(DialogTemplateComponent, {
      width: '250px',
      data: {
        title: 'Delete',
        content: this._generateMessage(),
        action: 'Delete',
        action_color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      confirm && this._delete();
    });
  }

  private _generateMessage(): string {
    const itemsLength = this.toDelete.length;
    return (
      'You are about to permanently remove ' +
      (itemsLength > 1 ? itemsLength + ' items' : 'this item') +'. Are you sure?'
    );
  }

  private _getItemsId(items: Product[]): Product['id'][] {
    return items.map((item) => item.id);
  }
}
