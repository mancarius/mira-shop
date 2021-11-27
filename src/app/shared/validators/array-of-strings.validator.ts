import { FormControl, ValidationErrors } from '@angular/forms';

export function validateArrayOfStrings(c: FormControl): ValidationErrors | null {
  const error = {
    arrayOfStrings: {
      invalid: true,
    },
  };
  if (!Array.isArray(c.value)) return error;
  return c.value.some((obj) => typeof obj !== 'string') ? error : null;
}
