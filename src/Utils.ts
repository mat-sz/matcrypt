/**
 * Joins two byte arrays together.
 */
export function joinArrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const c = new Uint8Array(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

/**
 * Splits an array into two, from index 0 (inclusive) to i (exclusive) and index i (inclusive) to the end.
 */
export function splitArray(a: Uint8Array, i: number): [Uint8Array, Uint8Array] {
  return [a.subarray(0, i), a.subarray(i)];
}
