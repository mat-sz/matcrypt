import { fromByteArray, toByteArray } from 'base64-js';
import * as matcrypt from '../src';

const testString = 'test';
const testArray = new Uint8Array([1, 2, 3, 4]);
const testArrayHash =
  'p8l22xcjrbQSdBeNyC6bd3lBqyAcad5h0PK8bSejWY9ZT6dI5Q2I08K/HiwucsPP73jDxtSvqQOR9+M6urykjg==';

describe('matcrypt', () => {
  it("should generate a key that's 44 characters long", async () => {
    const key = await matcrypt.randomKey();

    expect(key.length).toBe(44);
  });

  it('should generate two keys that are different from each other', async () => {
    const key = await matcrypt.randomKey();
    const anotherKey = await matcrypt.randomKey();

    expect(key).not.toBe(anotherKey);
  });

  it('should encrypt a test string that decrypts to same exact plaintext', async () => {
    const key = await matcrypt.randomKey();
    const ciphertext = await matcrypt.encryptString(key, testString);
    const plaintext = await matcrypt.decryptString(key, ciphertext);

    expect(plaintext).toBe(testString);
  });

  it('should encrypt a test binary array that decrypts to same exact binary array', async () => {
    const key = await matcrypt.randomKey();
    const encrypted = await matcrypt.encrypt(key, testArray);
    const decrypted = await matcrypt.decrypt(key, encrypted);

    expect(decrypted).toEqual(testArray);
  });

  it('should hash a test binary array and the hash should match the expected hash', async () => {
    const hash = await matcrypt.hash(testArray);

    expect(hash).toEqual(testArrayHash);
  });

  it('should create different encrypted outputs given same key and input (makes sure IVs are randomly generated)', async () => {
    const key = await matcrypt.randomKey();
    const encrypted = await matcrypt.encryptString(key, testString);
    const encryptedAgain = await matcrypt.encryptString(key, testString);

    expect(encrypted).not.toBe(encryptedAgain);
  });

  it('should accept both Uint8Array and base64 string for keys', async () => {
    const key = await matcrypt.randomKey();
    const keyBytes = toByteArray(key);
    const encrypted = await matcrypt.encrypt(key, testArray);
    const decrypted = await matcrypt.decrypt(keyBytes, encrypted);

    expect(decrypted).toEqual(testArray);
  });

  it('should accept both Uint8Array and base64 string for keys: reverse', async () => {
    const keyBytes = await matcrypt.randomKeyBytes();
    const key = fromByteArray(keyBytes);
    const encrypted = await matcrypt.encrypt(keyBytes, testArray);
    const decrypted = await matcrypt.decrypt(key, encrypted);

    expect(decrypted).toEqual(testArray);
  });
});
