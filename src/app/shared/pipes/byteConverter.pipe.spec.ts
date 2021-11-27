import { byteConverterPipe } from './byteConverter.pipe';

describe('byteConverter', () => {
  it('create an instance', () => {
    const pipe = new byteConverterPipe();
    expect(pipe).toBeTruthy();
  });
});
