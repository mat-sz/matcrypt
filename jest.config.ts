import type { Config } from 'jest';

const config: Config = {
  testEnvironment: './jestEnvironment.ts',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

export default config;
