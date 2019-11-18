'use strict'

const base64 = require('base64-js');
let crypto = null;

// Fallback to node-webcrypto-ossl when running within node.js
if (typeof window !== 'undefined' && window.crypto) {
    crypto = window.crypto;
} else {
    let WebCrypto = require('node-webcrypto-ossl');
    crypto = new WebCrypto();
}

if (!crypto) throw new Exception('WebCrypto is required to use this library.');

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
 * @param {Uint8Array} a 
 * @param {Uint8Array} b 
 * @returns {Uint8Array}
 */
function joinArrays(a, b) {
    let c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}

/**
 * Converts a base64-encoded key into a WebCrypto key object.
 * @param {string} string base64-encoded string
 * @returns {CryptoKey}
 */
async function stringToKey(string) {
    return await crypto.subtle.importKey(
        'raw',
        base64.toByteArray(string),
        settings.algorithm,
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * Extracts the prepended IV from a byte array.
 * @param {Uint8Array} a 
 * @returns {Uint8Array}
 */
function getIVFromArray(a) {
    return a.subarray(0, 12);
}

/**
 * Exctracts the data from a byte array (skipping IV).
 * @param {Uint8Array} a 
 * @returns {Uint8Array}
 */
function getDataFromArray(a) {
    return a.subarray(12);
}

class Matcrypt {
    /**
     * Generates a random base64 encoded key.
     * @returns {string}
     */
    static async randomKey() {
        let key = await crypto.subtle.generateKey({
            name: settings.algorithm,
            length: settings.keyLength
        }, true, ['encrypt', 'decrypt']);
        let raw = await crypto.subtle.exportKey('raw', key);

        return base64.fromByteArray(
            new Uint8Array(raw)
        );
    }

    /**
     * Creates a base64 encoded data hash. (SHA-512)
     * @param {Uint8Array} data 
     * @returns {string}
     */
    static async hash(data) {
        return base64.fromByteArray(
            new Uint8Array(
                await crypto.subtle.digest("SHA-512", data)
            )
        );
    }

    /**
     * Encrypts a string and returns a base64 encoded ciphertext.
     * @param {string} key base64-encoded key
     * @param {string} plaintext plaintext
     * @returns {string}
     */
    static async encryptString(key, plaintext) {
        return base64.fromByteArray(
            await this.encrypt(key, 
                textEncoder.encode(plaintext)
            )
        );
    }

    /**
     * Decrypts a string.
     * @param {string} key base64-encoded key
     * @param {string} encryptedString base64-encoded ciphertext
     * @returns {string}
     */
    static async decryptString(key, encryptedString) {
        if (!encryptedString) return null;

        return textDecoder.decode(
            await this.decrypt(key, 
                base64.toByteArray(encryptedString)
            )
        );
    }

    /**
     * Encrypts a byte array.
     * @param {string} keyStr base64-encoded key
     * @param {Uint8Array|ArrayBuffer} data data to encrypt
     * @returns {Uint8Array}
     */
    static async encrypt(keyStr, data) {
        let key = await stringToKey(keyStr);
        let iv = crypto.getRandomValues(new Uint8Array(12));
        let encrypted = new Uint8Array(await crypto.subtle.encrypt(
            {
                name: settings.algorithm,
                iv: iv,
            },
            key,
            data
        ));

        return joinArrays(iv, encrypted);
    }

    /**
     * Decrypts a byte array.
     * @param {string} keyStr base64-encoded key
     * @param {Uint8Array|ArrayBuffer} data data to decrypt
     * @returns {Uint8Array}
     */
    static async decrypt(keyStr, data) {
        let key = await stringToKey(keyStr);

        // Not the best check to determine if something is an ArrayBuffer.
        if (!data.subarray) data = new Uint8Array(data);
        
        return new Uint8Array(await crypto.subtle.decrypt(
            {
                name: settings.algorithm,
                iv: getIVFromArray(data),
            },
            key,
            getDataFromArray(data)
        ));
    }
}

module.exports = Matcrypt;