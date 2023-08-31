import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['tests/integration/utils/requestHelper.ts'],
};

export default config;
