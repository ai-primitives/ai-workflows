/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['./jest.setup.mjs'],
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        allowJs: true
      }
    }]
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library/jest-dom)/)'
  ]
};

export default config;
