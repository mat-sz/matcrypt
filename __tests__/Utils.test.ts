import * as Utils from '../src/Utils';

describe('Utils', () => {
  it('should join two arrays into one', async () => {
    const a = new Uint8Array([1, 2]);
    const b = new Uint8Array([3, 4]);
    const output = Utils.joinArrays(a, b);

    expect(output.length).toBe(4);
    expect(output).toEqual(new Uint8Array([1, 2, 3, 4]));
  });

  it('should split one array into two', async () => {
    const a = new Uint8Array([1, 2, 3, 4]);
    const output = Utils.splitArray(a, 3);

    expect(output.length).toBe(2);
    expect(output[0]).toEqual(new Uint8Array([1, 2, 3]));
    expect(output[1]).toEqual(new Uint8Array([4]));
  });
});
