import * as RSA from '../src/RSA';

const testString = 'test';
const testArray = new Uint8Array([1, 2, 3, 4]);

describe('AES', () => {
  it('should generate a key pair', async () => {
    const keyPair = await RSA.randomKeyPair();

    expect(keyPair.publicKey.length).toBeGreaterThan(100);
    expect(keyPair.privateKey.length).toBeGreaterThan(100);
  });

  it('should generate two key pairs that are different from each other', async () => {
    const keyPair = await RSA.randomKeyPair();
    const anotherKeyPair = await RSA.randomKeyPair();

    expect(keyPair.privateKey).not.toBe(anotherKeyPair.privateKey);
    expect(keyPair.publicKey).not.toBe(anotherKeyPair.publicKey);
  });

  it('should encrypt a test string that decrypts to same exact plaintext', async () => {
    const keyPair = await RSA.randomKeyPair();
    const ciphertext = await RSA.encryptString(keyPair.publicKey, testString);
    const plaintext = await RSA.decryptString(keyPair.privateKey, ciphertext);

    expect(plaintext).toBe(testString);
  });

  it('should encrypt a test binary array that decrypts to same exact binary array', async () => {
    const keyPair = await RSA.randomKeyPair();
    const encrypted = await RSA.encrypt(keyPair.publicKey, testArray);
    const decrypted = await RSA.decrypt(keyPair.privateKey, encrypted);

    expect(decrypted).toEqual(testArray);
  });

  it('should create different encrypted outputs given same key and input (makes sure IVs are randomly generated)', async () => {
    const keyPair = await RSA.randomKeyPair();
    const encrypted = await RSA.encryptString(keyPair.publicKey, testString);
    const encryptedAgain = await RSA.encryptString(
      keyPair.publicKey,
      testString
    );

    expect(encrypted).not.toBe(encryptedAgain);
  });
});
