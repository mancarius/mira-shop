import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemService } from 'src/app/services/item.service';

export class validateItemName {
  static createValidator(
    itemSrv: ItemService,
    sku: string | undefined
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const error = {
        uniqueName: {
          invalid: true,
        },
      };

      return from(itemSrv.findByName(control.value)).pipe(
        map((result) => {
          const filteredList = result.filter((item) => item.sku !== sku);
          return filteredList.length > 0 ? error : null;
        })
      );
    };
  }
}
