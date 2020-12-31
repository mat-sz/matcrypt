import * as Hashing from '../src/Hashing';

const testArray = new Uint8Array([1, 2, 3, 4]);
const testArrayHash =
  'p8l22xcjrbQSdBeNyC6bd3lBqyAcad5h0PK8bSejWY9ZT6dI5Q2I08K/HiwucsPP73jDxtSvqQOR9+M6urykjg==';

describe('Hashing', () => {
  it('should hash a test binary array and the hash should match the expected hash', async () => {
    const hash = await Hashing.hash(testArray);

    expect(hash).toEqual(testArrayHash);
  });
});
