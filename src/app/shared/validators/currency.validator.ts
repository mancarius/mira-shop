import { FormControl, ValidationErrors } from "@angular/forms";
import { currency as currencies } from "../common-currency";
import { Currencies } from "../interfaces/currencies";

export function validateCurrency(c: FormControl): ValidationErrors | null {
  const test: keyof Currencies = c.value?.toUpperCase();
    const exist: boolean = test in currencies;

    return exist
      ? null
      : {
          country: {
            invalid: true,
          },
        };
}