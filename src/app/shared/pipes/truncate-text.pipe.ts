import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  transform(value: string, ...args: number[]): unknown {
    const strLength = value.length;
    const maxLength = args[0] || 30;
    if (strLength > maxLength) {
      const end = (maxLength/3).toFixed(0);
      value = value.slice(0, Number(end)) + '...' + value.slice(-7);
    }
    return value;
  }

}
