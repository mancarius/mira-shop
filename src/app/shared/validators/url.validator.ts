import { FormControl, ValidationErrors } from '@angular/forms';

export function validateUrl(c: FormControl): ValidationErrors | null {
  const error = {
    url: {
      invalid: true,
    },
  };
  let url;

  try {
    url = new URL(c.value);
  } catch (_) {
    return error;
  }

  return url.protocol !== 'http:' && url.protocol !== 'https:' ? error : null;
}
