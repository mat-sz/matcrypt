import Environment from 'jest-environment-jsdom';
import { TextEncoder, TextDecoder } from 'util';
import { webcrypto } from 'node:crypto';

export default class CustomTestEnvironment extends Environment {
  async setup(): Promise<void> {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      // @ts-ignore
      this.global.TextEncoder = TextEncoder;
      // @ts-ignore
      this.global.TextDecoder = TextDecoder;
    }

    if (typeof this.global.crypto === 'undefined') {
      // @ts-ignore
      this.global.crypto = webcrypto;
    }
  }
}
