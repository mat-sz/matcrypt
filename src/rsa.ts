const keyParams = {
  name: 'RSA-OAEP',
  modulusLength: 2048,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  hash: 'SHA-256',
} as RsaHashedKeyGenParams;

export async function generateKeyPair() {
  const keyPair: CryptoKeyPair = (await crypto.subtle.generateKey(
    keyParams,
    true,
    ['encrypt', 'decrypt']
  )) as CryptoKeyPair;

  const publicKey = JSON.stringify(
    await crypto.subtle.exportKey('jwk', keyPair.publicKey)
  );

  return {
    keyPair,
    publicKey,
  };
}
