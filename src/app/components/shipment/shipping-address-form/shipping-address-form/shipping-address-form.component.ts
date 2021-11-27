import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShipmentService } from 'src/app/services/shipment.service';
import { ZipCodebaseService } from 'src/app/services/zip-codebase.service';
import { countries } from 'src/app/shared/countries';
import { validateCountry } from 'src/app/shared/validators/country.validator';
import { Country } from 'src/app/shared/interfaces/country';
import { ShippingAddress } from 'src/app/shared/interfaces/shipping-address';
import { FieldNames } from 'src/app/shared/types/field-names';

@Component({
  selector: 'app-shipping-address-form',
  templateUrl: './shipping-address-form.component.html',
  styleUrls: ['./shipping-address-form.component.scss'],
})
export class ShippingAddressFormComponent implements OnInit {
  private user = this._auth.currentUser;
  public countries: Country[] = countries;
  public cities: string[] = [];
  public province: string = '';
  private _dialCode: Country['dial_code'] | null = null;

  private _country = new FormControl('', [
    Validators.required,
    validateCountry,
  ]);
  private _zip = new FormControl({ value: '', disabled: true }, [
    Validators.required,
  ]);
  private _phone = new FormControl({ value: '', disabled: true }, [
    Validators.required,
    Validators.pattern(/\+\d{2,4}\s\d{9,10}/),
  ]);
  private _city = new FormControl(
    { value: '', disabled: true },
    Validators.required
  );
  private _street = new FormControl('', Validators.required);
  private _recipient = new FormControl(
    this.user?.displayName,
    Validators.required
  );
  private _province = new FormControl(
    { value: '', disabled: true },
    Validators.required
  );

  public addressForm = new FormGroup({
    country: this._country,
    zip: this._zip,
    phone: this._phone,
    street: this._street,
    recipient: this._recipient,
    city: this._city,
    province: this._province,
  });

  private _address: ShippingAddress | null = this._shipment.shippingAddress;

  @Output() onSubmit = new EventEmitter();

  constructor(
    private _auth: AuthenticationService,
    private _zipServ: ZipCodebaseService,
    private _shipment: ShipmentService,
    private _error: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this._address && this._formInit();
    this._onFormChangeInit();
  }

  private _formInit(): void {
    this.addressForm.setValue(this._address as ShippingAddress);
    if (!this.addressForm.invalid) {
      this._field('zip')?.enable();
      this._field('city')?.enable();
      this._field('province')?.enable();
      this._field('phone')?.enable();
    }
  }

  /**
   *
   *
   * @private
   * @memberof ShippingAddressFormComponent
   */
  private _onFormChangeInit() {
    this._field('country')?.valueChanges.subscribe(
      this._onCountryChange.bind(this)
    );

    this._field('zip')?.valueChanges.subscribe(this._onZIPChange.bind(this));

    this._field('phone')?.valueChanges.subscribe(
      this._onPhoneChange.bind(this)
    );
  }

  /**
   *
   *
   * @private
   * @param {string} code
   * @memberof ShippingAddressFormComponent
   */
  private _onCountryChange(code: string): void {
    try {
      if (this._isValidCountryCode(code)) {
        this._field('zip')?.enable();
        this._dialCode = this._getDialCodeByCountry(code);
        this._addDialCodeIfNotExists('');
        this._field('phone')?.enable();
      } else {
        this._field('zip')?.disable();
        this._field('phone')?.disable();
      }
    } catch (error: any) {
      console.error(error);
      this._error
        .add(error)
        .and.showMessage('Unable to load country informations');
    }
  }

  /**
   * Returns the filed abstract control if exist
   *
   * @private
   * @param {string} fieldName
   * @return {*}
   * @memberof ShippingAddressFormComponent
   */
  private _field(fieldName: FieldNames): AbstractControl | null {
    const formField = this.addressForm.get(fieldName);
    if (formField !== null) {
      return formField;
    } else {
      throw new Error('Field [' + fieldName + '] not found in the form group.');
    }
  }

  /**
   *
   *
   * @private
   * @param {number} zip
   * @return {*}  {Promise<void>}
   * @memberof ShippingAddressFormComponent
   */
  private async _onZIPChange(zip: number): Promise<void> {
    if (this._countryCode && zip) {
      try {
        const { cities, province } = await this._getCityAndProvince(
          zip,
          this._countryCode
        );
        this._setAndEnableCityField(cities);
        this._setAndEnableProvinceField(province);
      } catch (error: any) {
        // server errors
        if (!(error instanceof Error)) {
          this._error.add(error);
        } // client errors
        else {
          this._field('zip')?.setErrors({ incorrect: true });
        }
      }
    } else if (this._countryCode === null) {
      this._field('country')?.setErrors({ incorrect: true });
    } else {
      this._field('zip')?.setErrors({ incorrect: true });
    }
  }

  /**
   * Retrieves city and province by zip and country codes
   *
   * @private
   * @param {number} zip
   * @param {string} country
   * @return {*}  {Promise<void>}
   * @memberof ShippingAddressFormComponent
   */
  private async _getCityAndProvince(
    zip: number,
    country: string
  ): Promise<{ cities: string[]; province: string }> {
    try {
      const cities = await this._zipServ.getCities(zip, country);
      if (!cities.length) {
        throw new Error('No city found');
      }

      const province = await this._zipServ.getProvince(zip, country);
      if (!province) {
        throw new Error('No province found');
      }

      return { cities, province };
    } catch (err: any) {
      console.warn(err);
      throw err;
    }
  }

  /**
   * Assign the passed value to the city field and enable it
   *
   * @private
   * @param {string} city
   * @memberof ShippingAddressFormComponent
   */
  private _setAndEnableCityField(cities: string[]): void {
    this.cities = cities; // for update select options
    this._field('city')?.setValue(cities[0]);
    this._field('city')?.enable();
  }

  /**
   * Assign the passed value to the province field and enable it
   *
   * @private
   * @param {string} province
   * @memberof ShippingAddressFormComponent
   */
  private _setAndEnableProvinceField(province: string): void {
    this._field('province')?.setValue(province);
    this._field('province')?.enable();
  }

  /**
   *
   *
   * @private
   * @param {string} phone
   * @memberof ShippingAddressFormComponent
   */
  private _onPhoneChange(phone: string): void {
    try {
      this._addDialCodeIfNotExists(phone);
    } catch (err: any) {
      this._field('phone')?.setValue('');
      console.error(err);
    }
  }

  /**
   * Add a dial code to #phone input if missing
   *
   * @private
   * @param {string} phone
   * @memberof ShippingAddressFormComponent
   */
  private _addDialCodeIfNotExists(phone: string) {
    function getPhoneWithoutDialCode(phone: string, dialCode: string): string {
      return phone.substring(dialCode.length + 1); // '+1' because of the last space
    }

    if (this._dialCode && this._countryCode) {
      const dialCode = this._dialCode;
      const dialCodeIndex = phone.indexOf(dialCode + ' ');
      const phoneWithoutDialCode =
        dialCodeIndex === 0
          ? getPhoneWithoutDialCode(phone, this._dialCode)
          : phone;

      if (dialCodeIndex !== 0) {
        let fullString = dialCode + ' ';
        if (phone.length > dialCode.length) {
          fullString += phoneWithoutDialCode;
        }
        this._field('phone')?.setValue(fullString);
      }
    } else {
      throw new Error('Invalid parameters');
    }
  }

  /**
   * Return a valid country code or null if it is not.
   *
   * @readonly
   * @private
   * @type {(Country['code'] | null)}
   * @memberof ShippingAddressFormComponent
   */
  private get _countryCode(): Country['code'] | null {
    try {
      const countryCode = this._field('country')?.value;
      return this._isValidCountryCode(countryCode) ? countryCode : null;
    } catch (error: any) {
      console.error(error);
      this._error.add(error);
      return null;
    }
  }

  /**
   * Return true if the country code is valid
   *
   * @private
   * @param {string} code
   * @return {*}  {boolean}
   * @memberof ShippingAddressFormComponent
   */
  private _isValidCountryCode(code: string): boolean {
    return this.countries.some((country) => country.code === code);
  }

  /**
   * Return the dial code of the passed country
   *
   * @private
   * @param {Country['code']} countryCode
   * @return {*}  {(Country['dial_code'] | null)}
   * @memberof ShippingAddressFormComponent
   */
  private _getDialCodeByCountry(
    countryCode: Country['code']
  ): Country['dial_code'] | null {
    return (
      this.countries.find((country) => country.code === countryCode)
        ?.dial_code ?? null
    );
  }

  /**
   * Return the field associate error message if exist
   *
   * @param {string} fieldName
   * @return {*}  {(string | null)}
   * @memberof ShippingAddressFormComponent
   */
  public getErrorMessage(fieldName: FieldNames): string | null {
    try {
      const field = this._field(fieldName);

      if (field?.hasError('incorrect') || field?.invalid) {
        switch (fieldName) {
          case 'country':
            return 'Select a valid country';
          case 'zip':
            return 'Zip code not found in selected country';
          case 'phone':
            return 'This telefon number is not valid';
          default:
            return 'Insert a valid value';
        }
      }
    } catch (error: any) {
      console.error(error);
      this._error.add(error);
    }

    return '';
  }

  /**
   * Save the aggregate value of the FormGroup and emit output event
   *
   * @memberof ShippingAddressFormComponent
   */
  public save(): void {
    if (!this.addressForm.invalid) {
      this._shipment.shippingAddress =
        this.addressForm.getRawValue() as ShippingAddress;
      this.onSubmit.emit();
    }
  }

  /**
   * Return true if the passed field is invalid, otherwise return false
   *
   * @param {string} field
   * @return {*}  {boolean}
   * @memberof ShippingAddressFormComponent
   */
  public isInvalid(fieldName: FieldNames): boolean {
    try {
      return this._field(fieldName)?.invalid ?? false;
    } catch (error: any) {
      console.error(error);
      this._error.add(error);
      return true;
    }
  }
}
