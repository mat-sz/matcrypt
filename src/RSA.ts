import { fromByteArray } from 'base64-js';

const keyParams = {
  name: 'RSA-OAEP',
  modulusLength: 2048,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  hash: 'SHA-256',
} as RsaHashedKeyGenParams;

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface KeyPairBytes {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
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
