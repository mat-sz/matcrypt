import * as matcrypt from '../src';

const testString = 'test';
const testArray = new Uint8Array([1, 2, 3, 4]);
const testArrayHash =
  'p8l22xcjrbQSdBeNyC6bd3lBqyAcad5h0PK8bSejWY9ZT6dI5Q2I08K/HiwucsPP73jDxtSvqQOR9+M6urykjg==';

describe('matcrypt', () => {
  it("should generate a key that's 44 characters long", async () => {
    let key = await matcrypt.randomKey();

    expect(key.length).toBe(44);
  });

  it('should generate two keys that are different from each other', async () => {
    let key = await matcrypt.randomKey();
    let anotherKey = await matcrypt.randomKey();

    expect(key).not.toBe(anotherKey);
  });

  it('should encrypt a test string that decrypts to same exact plaintext', async () => {
    let key = await matcrypt.randomKey();
    let ciphertext = await matcrypt.encryptString(key, testString);
    let plaintext = await matcrypt.decryptString(key, ciphertext);

    expect(plaintext).toBe(testString);
  });

  it('should encrypt a test binary array that decrypts to same exact binary array', async () => {
    let key = await matcrypt.randomKey();
    let encrypted = await matcrypt.encrypt(key, testArray);
    let decrypted = await matcrypt.decrypt(key, encrypted);

    expect(decrypted).toEqual(testArray);
  });

  it('should hash a test binary array and the hash should match the expected hash', async () => {
    let hash = await matcrypt.hash(testArray);

    expect(hash).toEqual(testArrayHash);
  });

  it('should create different encrypted outputs given same key and input (makes sure IVs are randomly generated)', async () => {
    let key = await matcrypt.randomKey();

    let encrypted = await matcrypt.encryptString(key, testString);
    let encryptedAgain = await matcrypt.encryptString(key, testString);

    expect(encrypted).not.toBe(encryptedAgain);
  });
});