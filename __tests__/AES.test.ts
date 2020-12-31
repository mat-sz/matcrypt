import { fromByteArray, toByteArray } from 'base64-js';
import * as AES from '../src/AES';

const testString = 'test';
const testArray = new Uint8Array([1, 2, 3, 4]);

describe('AES', () => {
  it("should generate a key that's 44 characters long", async () => {
    const key = await AES.randomKey();

    expect(key.length).toBe(44);
  });

  it("should generate a key that's 32 bytes long", async () => {
    const key = await AES.randomKeyBytes();

    expect(key.length).toBe(32);
  });

  it('should generate two keys that are different from each other', async () => {
    const key = await AES.randomKey();
    const anotherKey = await AES.randomKey();

    expect(key).not.toBe(anotherKey);
  });

  it('should encrypt a test string that decrypts to same exact plaintext', async () => {
    const key = await AES.randomKey();
    const ciphertext = await AES.encryptString(key, testString);
    const plaintext = await AES.decryptString(key, ciphertext);

    expect(plaintext).toBe(testString);
  });

  it('should encrypt a test binary array that decrypts to same exact binary array', async () => {
    const key = await AES.randomKey();
    const encrypted = await AES.encrypt(key, testArray);
    const decrypted = await AES.decrypt(key, encrypted);

    expect(decrypted).toEqual(testArray);
  });

  it('should create different encrypted outputs given same key and input (makes sure IVs are randomly generated)', async () => {
    const key = await AES.randomKey();
    const encrypted = await AES.encryptString(key, testString);
    const encryptedAgain = await AES.encryptString(key, testString);

    expect(encrypted).not.toBe(encryptedAgain);
  });

  it('should accept both Uint8Array and base64 string for keys', async () => {
    const key = await AES.randomKey();
    const keyBytes = toByteArray(key);
    const encrypted = await AES.encrypt(key, testArray);
    const decrypted = await AES.decrypt(keyBytes, encrypted);

    expect(decrypted).toEqual(testArray);
  });

  it('should accept both Uint8Array and base64 string for keys: reverse', async () => {
    const keyBytes = await AES.randomKeyBytes();
    const key = fromByteArray(keyBytes);
    const encrypted = await AES.encrypt(keyBytes, testArray);
    const decrypted = await AES.decrypt(key, encrypted);

    expect(decrypted).toEqual(testArray);
  });
});
