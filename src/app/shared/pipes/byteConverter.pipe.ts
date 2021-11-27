import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteConverter',
})
export class byteConverterPipe implements PipeTransform {
  transform(value: number | string, ...args: number[]): string {
    const precision = args[0] || 2;
    const byte = Number(value);

    if (!precision) return String(value);

    if (byte === 0) return '0 b';

    const KB = byte / 1024;
    const MB = KB / 1024;

    if (KB < 1) {
      return byte + ' byte';
    }

    if (MB < 1) {
      return KB.toFixed(0) + ' KB';
    }

    return MB.toPrecision(precision) + ' MB';
  }
}
