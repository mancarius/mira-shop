import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { Product } from 'src/app/shared/interfaces/product';
import firebase from 'firebase';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { AdminItemEditorComponent } from './admin-item-editor/admin-item-editor.component';
import { AdminItemService } from 'src/app/services/admin-item.service';

@Component({
  selector: 'admin-items',
  templateUrl: './admin-items.component.html',
  styleUrls: ['./admin-items.component.scss'],
})
export class AdminItemsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['select', 'name', 'state', 'price', 'created'];
  resultsLength = 0;
  isLoadingResults = true;
  dataSource: Product[] = [];
  selection = new SelectionModel<Product>(true, []);
  destroyed = new Subject<void>();
  isMobileLayout = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private _items: AdminItemService,
    private _error: ErrorHandlerService,
    private _breakpointObserver: BreakpointObserver,
    private _dialog: MatDialog
  ) {}

  ngOnInit() {
    this._items.items$.subscribe(
      (items) => {
        this.dataSource = items;
        this.isLoadingResults = false;
      },
      (error) => {
        console.error(error);
        this._error
          .add(error)
          .and.showMessage('Items load failed.\n' + error.message);
      }
    );
    // get items length, but not results length
    this._items.length$.subscribe(({ value }) => {
      this.resultsLength = value;
    });

    this._breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        this.isMobileLayout = result.matches;
        if (this.isMobileLayout) {
          this.displayedColumns = ['select', 'name', 'price', 'state'];
        } else {
          this.displayedColumns = [
            'select',
            'name',
            'price',
            'created',
            'state',
          ];
        }
      });
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        console.log(this.sort.active);
        switch (this.sort.active) {
          case 'name':
            this._items.orderByName(
              this.sort.direction as firebase.firestore.OrderByDirection
            );
            break;
          case 'price':
            this._items.orderByPrice(
              this.sort.direction as firebase.firestore.OrderByDirection
            );
            break;
          default:
            break;
        }
        const startAt = this.paginator.pageIndex * this.paginator.pageSize;
        this._items.startAt(startAt);
        this._items.maxResults(this.paginator.pageSize);
        return of(null);
      })
    );
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   * @returns {boolean}
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  /**
   * The label for the checkbox on the passed row
   * @param row
   * @returns
   */
  checkboxLabel(row?: Product): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  open(itemId?: string): void {
    if (typeof itemId !== 'string' && typeof itemId !== 'undefined') {
      throw new TypeError(
        'Expected a string but received the following type: ' + typeof itemId
      );
    }
    const dialogRef = this._dialog.open(AdminItemEditorComponent, {
      data: { itemId: itemId ?? null },
      disableClose: true,
      maxWidth: 500,
      width: '100%',
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
