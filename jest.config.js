/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        allowJs: true
      }
    }]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library/jest-dom)/)'
  ],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};

export default config;
