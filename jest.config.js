module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/dist', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'dist/**/*.js',
    '!dist/**/*.d.ts',
    '!dist/index.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/dist/tests/setup.js'],
  testTimeout: 10000,
};
