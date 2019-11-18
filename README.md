# matcrypt

## Disclaimer

While I've made sure to adhere to all best practices when it comes to AES and WebCrypto, I am not a cryptography professional. This code is not audited. I use this in production, but you should **never** blindly trust any cryptographic code from the internet.

This library works within node, but requires the package `node-webcrypto-ossl` to be installed. This package's page claims that the package is not audited as well. It's included in devDependencies only for the unit tests.

## Project description

A WebCrypto wrapper I use for my projects to make certain common tasks easy.

Common tasks this library is optimized for are:

**(AES-256)**

* Random key generation
* String encryption/decryption (ciphertext is base64 encoded as well for easy storage)
* Binary data encryption/decryption

*(The library handles IV randomization and storage.)*

**(SHA-512)**

* Compute a base64-encoded hash of binary data

# Code example

Within a React project:

```js
import matcrypt from 'matcrypt';

async function example() {
    let key = await matcrypt.randomKey();
    let ciphertext = await matcrypt.encryptString(key, testString);
    let plaintext = await matcrypt.decryptString(key, ciphertext);
}
```