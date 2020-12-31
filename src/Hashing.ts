import { fromByteArray } from 'base64-js';

/**
 * Creates a base64 encoded data hash. (SHA-512)
 */
export async function hash(data: Uint8Array): Promise<string> {
  return fromByteArray(
    new Uint8Array(await crypto.subtle.digest('SHA-512', data))
  );
}
