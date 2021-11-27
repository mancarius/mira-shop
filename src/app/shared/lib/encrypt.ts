var makeCRCTable = function () {
  var c;
  var crcTable = [];
  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
};


export class Encrypt {
  public static async sha512(base: string) {
    return crypto.subtle
      .digest('SHA-512', new TextEncoder().encode(base))
      .then(Encrypt.buffer2string);
  }

  public static async sha1(base: string) {
    return crypto.subtle
      .digest('SHA-1', new TextEncoder().encode(base))
      .then(Encrypt.buffer2string);
  }

  public static buffer2string(buf: ArrayBuffer): string {
    return Array.prototype.map
      .call(new Uint8Array(buf), (x) => ('00' + x.toString(16)).slice(-2))
      .join('');
  }
}
