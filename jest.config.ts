import { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@shared-lib/(.*)': '<rootDir>/shared-lib/$1',
    '@common/(.*)': '<rootDir>/common/$1',
    '@core/(.*)': '<rootDir>/core/$1',
    '@modules/(.*)': '<rootDir>/modules/$1',
  },
};

export default jestConfig;
