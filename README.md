# matcrypt

<p align="center">
<img alt="workflow" src="https://img.shields.io/github/workflow/status/mat-sz/matcrypt/Node.js%20CI%20(yarn)">
<a href="https://npmjs.com/package/matcrypt">
<img alt="npm" src="https://img.shields.io/npm/v/matcrypt">
<img alt="npm" src="https://img.shields.io/npm/dw/matcrypt">
<img alt="NPM" src="https://img.shields.io/npm/l/matcrypt">
</a>
</p>

## Disclaimer

While I've made sure to adhere to all best practices when it comes to AES and WebCrypto, I am not a cryptography professional. This code is not audited. I use this in production, but you should **never** blindly trust any cryptographic code from the internet.

This library only works in browser environments that support WebCrypto.

## About

WebCrypto wrapper that makes AES easy.

### This library supports

**(AES-256)**

- Random key generation
- String encryption/decryption (ciphertext is base64 encoded as well for easy storage)
- Binary data encryption/decryption

_(The library handles IV randomization and storage.)_

**(SHA-512)**

- Compute a base64-encoded hash of binary data

## Code example

```ts
import * as matcrypt from 'matcrypt';

async function example() {
  let key = await matcrypt.randomKey();
  let ciphertext = await matcrypt.encryptString(key, testString);
  let plaintext = await matcrypt.decryptString(key, ciphertext);
}
```
