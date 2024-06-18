module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/modules/content/application/$1',
    '^@presentation/(.*)$': '<rootDir>/src/modules/content/presentation/$1',
    '^@domain/(.*)$': '<rootDir>/src/modules/content/domain/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/modules/content/infrastructure/$1',
  },
  setupFiles: ['./test/setup.ts'],
};
