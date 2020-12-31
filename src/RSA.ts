import { fromByteArray, toByteArray } from 'base64-js';

import * as AES from './AES';
import { joinArrays } from './utils';

const keyParams = {
  name: 'RSA-OAEP',
  modulusLength: 2048,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  hash: 'SHA-256',
} as RsaHashedKeyGenParams;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface KeyPairBytes {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

/**
 * Extracts the prepended AES secret from a byte array.
 */
function getSecretFromArray(a: Uint8Array): Uint8Array {
  return a.subarray(0, 32);
}

/**
 * Exctracts the data from a byte array (skipping secret).
 */
function getDataFromArray(a: Uint8Array): Uint8Array {
  return a.subarray(32);
}

/**
 * Converts a base64-encoded key into a WebCrypto key object.
 * @param input base64-encoded string
 */
function stringToKey(input: KeyType, isPublic: boolean): Promise<CryptoKey> {
  let keyBytes: Uint8Array;

  if (typeof input === 'string') {
    keyBytes = toByteArray(input);
  } else {
    keyBytes = new Uint8Array(input);
  }

  return crypto.subtle.importKey('raw', keyBytes, keyParams, true, [
    isPublic ? 'encrypt' : 'decrypt',
  ]);
}

export async function generateKeyPair(): Promise<KeyPair> {
  const keyPair = await generateKeyPairBytes();

  return {
    publicKey: fromByteArray(keyPair.publicKey),
    privateKey: fromByteArray(keyPair.privateKey),
  };
}

export async function generateKeyPairBytes(): Promise<KeyPairBytes> {
  const keyPair = (await crypto.subtle.generateKey(keyParams, true, [
    'encrypt',
    'decrypt',
  ])) as CryptoKeyPair;

  const publicKey = await crypto.subtle.exportKey('raw', keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey('raw', keyPair.privateKey);

  return {
    publicKey: new Uint8Array(publicKey),
    privateKey: new Uint8Array(privateKey),
  };
}

/**
 * Encrypts a string and returns a base64 encoded ciphertext.
 * @param keyStr public key
 * @param data data to encrypt
 */
export async function encryptString(
  key: KeyType,
  plaintext: string
): Promise<string> {
  return fromByteArray(await encrypt(key, textEncoder.encode(plaintext)));
}

/**
 * Decrypts a string.
 * @param keyStr private key
 * @param data data to decrypt
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
 * @param keyStr public key
 * @param data data to encrypt
 */
export async function encrypt(
  keyStr: KeyType,
  data: Uint8Array | ArrayBuffer
): Promise<Uint8Array> {
  const publicKey = await stringToKey(keyStr, true);

  const secret = await AES.randomKeyBytes();
  const encryptedSecret = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' } as RsaOaepParams,
    publicKey,
    secret
  );

  const encrypted = await AES.encrypt(secret, data);

  return joinArrays(new Uint8Array(encryptedSecret), encrypted);
}

/**
 * Decrypts a byte array.
 * @param keyStr private key
 * @param data data to decrypt
 */
export async function decrypt(
  keyStr: KeyType,
  data: Uint8Array | ArrayBuffer
): Promise<Uint8Array> {
  const privateKey = await stringToKey(keyStr, false);

  if (data instanceof ArrayBuffer) {
    data = new Uint8Array(data);
  }

  const secret = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' } as RsaOaepParams,
    privateKey,
    getSecretFromArray(data as Uint8Array)
  );

  return await AES.decrypt(secret, getDataFromArray(data as Uint8Array));
}
