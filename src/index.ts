import { fromByteArray, toByteArray } from 'base64-js';

// While it would be possible to let other people alter the settings,
// I feel like it'd create more confusion. All modern devices can
// handle AES-GCM-256 perfectly fine.
const settings = {
  algorithm: 'AES-GCM',
  keyLength: 256,
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Joins two byte arrays together.
 */
function joinArrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  let c = new Uint8Array(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

/**
 * Converts a base64-encoded key into a WebCrypto key object.
 * @param input base64-encoded string
 */
function stringToKey(input: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    toByteArray(input),
    settings.algorithm,
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Extracts the prepended IV from a byte array.
 */
function getIVFromArray(a: Uint8Array): Uint8Array {
  return a.subarray(0, 12);
}

/**
 * Exctracts the data from a byte array (skipping IV).
 */
function getDataFromArray(a: Uint8Array): Uint8Array {
  return a.subarray(12);
}

/**
 * Generates a random base64 encoded key.
 */
export async function randomKey(): Promise<string> {
  let key = await crypto.subtle.generateKey(
    {
      name: settings.algorithm,
      length: settings.keyLength,
    },
    true,
    ['encrypt', 'decrypt']
  );
  let raw = await crypto.subtle.exportKey('raw', key);

  return fromByteArray(new Uint8Array(raw));
}

/**
 * Creates a base64 encoded data hash. (SHA-512)
 */
export async function hash(data: Uint8Array): Promise<string> {
  return fromByteArray(
    new Uint8Array(await crypto.subtle.digest('SHA-512', data))
  );
}

/**
 * Encrypts a string and returns a base64 encoded ciphertext.
 */
export async function encryptString(
  key: string,
  plaintext: string
): Promise<string> {
  return fromByteArray(await encrypt(key, textEncoder.encode(plaintext)));
}

/**
 * Decrypts a string.
 */
export async function decryptString(
  key: string,
  encryptedString: string
): Promise<string | null> {
  if (!encryptedString) {
    return null;
  }

  return textDecoder.decode(await decrypt(key, toByteArray(encryptedString)));
}

/**
 * Encrypts a byte array.
 * @param keyStr base64-encoded key
 * @param data data to encrypt
 */
export async function encrypt(
  keyStr: string,
  data: Uint8Array | ArrayBuffer
): Promise<Uint8Array> {
  let key = await stringToKey(keyStr);
  let iv = crypto.getRandomValues(new Uint8Array(12));
  let encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        name: settings.algorithm,
        iv: iv,
      },
      key,
      data
    )
  );

  return joinArrays(iv, encrypted);
}

/**
 * Decrypts a byte array.
 * @param keyStr base64-encoded key
 * @param data data to decrypt
 */
export async function decrypt(
  keyStr: string,
  data: Uint8Array | ArrayBuffer
): Promise<Uint8Array> {
  let key = await stringToKey(keyStr);

  if (data instanceof ArrayBuffer) {
    data = new Uint8Array(data);
  }

  return new Uint8Array(
    await crypto.subtle.decrypt(
      {
        name: settings.algorithm,
        iv: getIVFromArray(data as Uint8Array),
      },
      key,
      getDataFromArray(data as Uint8Array)
    )
  );
}
