import { FormControl, ValidationErrors } from "@angular/forms";
import { countries } from "../countries";

export function validateCountry(c: FormControl): ValidationErrors | null {
    const exist = countries.some(
      (country) => country.code === c.value
    );

    return exist
      ? null
      : {
          country: {
            invalid: true,
          },
        };
}