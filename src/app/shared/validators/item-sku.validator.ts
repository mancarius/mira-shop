import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemService } from 'src/app/services/item.service';
import { Product } from '../interfaces/product';

export class validateItemSku {
  static createValidator(
    itemSrv: ItemService,
    itemId: Product['id']
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const error = {
        duplicateSku: {
          invalid: true,
        },
      };

      return from(itemSrv.findBySku(control.value)).pipe(
        map((item) => {
          return item?.id !== itemId ? error : null;
        })
      );
    };
  }
}
