import { fromByteArray, toByteArray } from 'base64-js';

import { KeyType } from './types';
import { splitArray, joinArrays } from './Utils';

// While it would be possible to let other people alter the settings,
// I feel like it'd create more confusion. All modern devices can
// handle AES-GCM-256 perfectly fine.
const settings = {
  algorithm: 'AES-GCM',
  keyLength: 256,
};

export const ivLength = 12;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Converts a base64-encoded key into a WebCrypto key object.
 * @param input base64-encoded string
 */
function stringToKey(input: KeyType): Promise<CryptoKey> {
  let keyBytes: Uint8Array;

  if (typeof input === 'string') {
    keyBytes = toByteArray(input);
  } else {
    keyBytes = new Uint8Array(input);
  }

  return crypto.subtle.importKey('raw', keyBytes, settings.algorithm, true, [
    'encrypt',
    'decrypt',
  ]);
}

/**
 * Generates a random base64 encoded key.
 */
export async function randomKey(): Promise<string> {
  return fromByteArray(await randomKeyBytes());
}

/**
 * Generates a random key.
 */
export async function randomKeyBytes(): Promise<Uint8Array> {
  const key = await crypto.subtle.generateKey(
    {
      name: settings.algorithm,
      length: settings.keyLength,
    },
    true,
    ['encrypt', 'decrypt']
  );
  const raw = await crypto.subtle.exportKey('raw', key);

  return new Uint8Array(raw);
}

/**
 * Encrypts a string and returns a base64 encoded ciphertext.
 */
export async function encryptString(
  key: KeyType,
  plaintext: string
): Promise<string> {
  return fromByteArray(await encrypt(key, textEncoder.encode(plaintext)));
}

/**
 * Decrypts a string.
 */
export async function decryptString(
  key: KeyType,
  encryptedString: string
): Promise<string | null> {
  if (!encryptedString) {
    return null;
  }

  return textDecoder.decode(await decrypt(key, toByteArray(encryptedString)));
}

/**
 * Encrypts a byte array.
 * @param keyStr key
 * @param data data to encrypt
 */
export async function encrypt(
  keyStr: KeyType,
  data: Uint8Array | ArrayBuffer
): Promise<Uint8Array> {
  const key = await stringToKey(keyStr);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(
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
 * @param keyStr key
 * @param data data to decrypt
 */
export async function decrypt(
  keyStr: KeyType,
  data: Uint8Array | ArrayBuffer
): Promise<Uint8Array> {
  const key = await stringToKey(keyStr);

  if (data instanceof ArrayBuffer) {
    data = new Uint8Array(data);
  }

  const [iv, realData] = splitArray(data as Uint8Array, ivLength);

  return new Uint8Array(
    await crypto.subtle.decrypt(
      {
        name: settings.algorithm,
        iv,
      },
      key,
      realData
    )
  );
}
