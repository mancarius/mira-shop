import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { CategoryService } from 'src/app/services/category.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'category-input',
  templateUrl: './category-input.component.html',
  styleUrls: ['./category-input.component.scss'],
})
export class CategoryInputComponent implements OnInit {
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryControl = new FormControl();
  filteredCategories: Observable<string[]>;
  allCategories: string[] = [];

  @Input('categories') categories: string[] = [];
  @Input('label') label: string = '';
  @Output() onChanges = new EventEmitter();
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;

  constructor(
    private _category: CategoryService,
    private _error: ErrorHandlerService
  ) {
    this._initCategories();

    this.filteredCategories = this.categoryControl.valueChanges.pipe(
      startWith(null),
      map((category: string | null) =>
        category ? this._filter(category) : this._exclude()
      )
    );
  }

  ngOnInit(): void {}

  /**
   *
   *
   * @private
   * @return {*}  {Promise<void>}
   * @memberof CategoryInputComponent
   */
  private async _initCategories(): Promise<void> {
    // load all categories
    try {
      this.allCategories = await this._category.all();
    } catch (error: any) {
      console.error(error);
      this._error
        .add(error)
        .and.showMessage('Ops, i was unable to load categories');
    }
  }

  /**
   *
   *
   * @param {MatChipInputEvent} event
   * @memberof CategoryInputComponent
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our category
    if (value) {
      this.categories.push(value);
      this.onChanges.emit(this.categories);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.categoryControl.setValue(null);
  }

  /**
   *
   *
   * @param {string} category
   * @memberof CategoryInputComponent
   */
  remove(category: string): void {
    const index = this.categories.indexOf(category);

    if (index >= 0) {
      this.categories.splice(index, 1);
      this.onChanges.emit(this.categories);
    }
  }

  /**
   *
   *
   * @param {MatAutocompleteSelectedEvent} event
   * @memberof CategoryInputComponent
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    this.categories.push(event.option.viewValue);
    this.categoryInput.nativeElement.value = '';
    this.categoryControl.setValue(null);
    this.onChanges.emit(this.categories);
  }

  /**
   *
   *
   * @private
   * @param {string} value
   * @return {*}  {string[]}
   * @memberof CategoryInputComponent
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this._exclude().filter((category) =>
      category.toLowerCase().includes(filterValue)
    );
  }

  /**
   *
   *
   * @private
   * @return {*}  {string[]}
   * @memberof CategoryInputComponent
   */
  private _exclude(): string[] {
    return this.allCategories.filter(
      (category) => !this.categories.some((test) => test === category)
    );
  }
}
