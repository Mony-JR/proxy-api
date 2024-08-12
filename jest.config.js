module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/__test__/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/__test__/*.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },
  coverageReporters: ['text-summary', 'lcov'],
  moduleFileExtensions: ['ts', 'js'],
  // setupFiles: ["<rootDir>/src/__test__/setup.ts"], // Add this line to load setup file
};
