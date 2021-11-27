import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ItemService } from 'src/app/services/item.service';
import { currency } from 'src/app/shared/common-currency';
import { Asset } from 'src/app/shared/enums/asset';
import { Size } from 'src/app/shared/enums/size';
import { Currency } from 'src/app/shared/interfaces/currency';
import { Product } from 'src/app/shared/interfaces/product';
import { validateArrayOfStrings } from 'src/app/shared/validators/array-of-strings.validator';
import { validateCurrency } from 'src/app/shared/validators/currency.validator';
import { validateItemName } from 'src/app/shared/validators/item-name.validator';
import { validateItemSku } from 'src/app/shared/validators/item-sku.validator';
import { validateUrl } from 'src/app/shared/validators/url.validator';

@Component({
  selector: 'admin-item-editor-form',
  templateUrl: './admin-item-editor-form.component.html',
  styleUrls: ['./admin-item-editor-form.component.scss'],
})
export class AdminItemEditorFormComponent implements OnInit, OnChanges {
  public emptyImageUrl = Asset.noItemImage;
  public currencies: Currency[] = Object.values(currency);
  public form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/[A-Za-z]+?/),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.pattern(/[A-Za-z]+?/),
    ]),
    categories: new FormControl(
      [],
      [Validators.required, validateArrayOfStrings]
    ),
    image: new FormControl('', [Validators.required, validateUrl]),
    price: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]*\.[0-9]*/gm),
    ]),
    size: new FormControl('', [Validators.required]),
    currency: new FormControl('EUR', [Validators.required, validateCurrency]),
    is_available: new FormControl(true),
    sku: new FormControl('', Validators.required),
    created_at: new FormControl(''),
  });
  public sizes = [
    { value: Size.small, label: 'Small' },
    { value: Size.medium, label: 'Medium' },
    { value: Size.large, label: 'Large' },
    { value: Size.extraLarge, label: 'Extra Large' },
  ];

  @Input() item: Partial<Product> | null = null;
  @Output() onFormChanges = new EventEmitter();
  @Output() onError = new EventEmitter();
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  constructor(
    private _error: ErrorHandlerService,
    private _itemSrv: ItemService
  ) {}

  ngOnChanges() {
    if (this.item?.id) {
      try {
        const { id, ...itemWithoutId } = this.item;
        this.form.setValue(itemWithoutId);
      } catch (err: any) {
        this._error.add(err);
        this.onError.emit(err);
      }
    } else if (this.item?.sku) {
      this.form.get('sku')?.setValue(this.item?.sku);
    } else {
      this.form.reset();
    }
  }

  ngOnInit(): void {
    this._initSku();

    this.form
      .get('name')
      ?.setAsyncValidators([
        validateItemName.createValidator(this._itemSrv, this.item?.sku),
      ]);

    this.form.updateValueAndValidity();

    this.form.valueChanges.subscribe((data) => {
      this._setSku();
      this._emitForm();
    });
  }

  /**
   *
   *
   * @protected
   * @memberof AdminItemEditorFormComponent
   */
  protected _setSku(): void {
    const name = this.form.get('name');
    const size = this.form.get('size');
    const categories = this.form.get('categories');

    if (
      name?.valid &&
      size?.valid &&
      categories?.valid &&
      (!name.pristine || !size.pristine || !categories.pristine)
    ) {
      const currentSku = this.form.get('sku')?.value;
      const generatedSku = ItemService.generateSku(
        categories.value,
        name.value,
        size.value
      ).toLocaleUpperCase();
      if (currentSku !== generatedSku) {
        const skuControl = this.form.get('sku');
        skuControl?.setValue(generatedSku);
        skuControl?.dirty && skuControl.markAsPristine();
        skuControl?.markAsDirty();
      }
    }
  }

  /**
   *
   *
   * @private
   * @memberof AdminItemEditorFormComponent
   */
  private _initSku(): void {
    const skuControl = this.form.get('sku');
    if (!skuControl) throw new Error('Sku control not found');

    skuControl?.setAsyncValidators([
      validateItemSku.createValidator(this._itemSrv, this.item?.id),
    ]);
  }

  /**
   *
   *
   * @param {string[]} categories
   * @memberof AdminItemEditorFormComponent
   */
  public setCategories(categories: string[]) {
    this.form.get('categories')?.setValue(categories);
    this._emitForm();
  }

  /**
   *
   *
   * @private
   * @memberof AdminItemEditorFormComponent
   */
  private _emitForm(): void {
    this.onFormChanges.emit(this.form);
  }

  /**
   *
   *
   * @param {string} field
   * @return {*}  {string}
   * @memberof AdminItemEditorFormComponent
   */
  public getErrorMessage(field: string): string {
    const error = Object.keys(this.form.get(field)?.errors ?? {})[0];
    switch (error) {
      case 'pattern':
        return 'The ' + field + ' must contain at least a letter';
      case 'url':
        return 'This url format is not valid';
      case 'required':
        return 'Need a value';
      case 'duplicateSku':
        return 'This sku already exists in database';
      case 'name':
        return 'This name already exist or is an invalid string';
      case 'price':
        return 'Price must contain only numbers and a dot'
      default:
        return 'Invalid value';
    }
  }
}
