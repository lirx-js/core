const path = require('node:path');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['../'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: path.join(__dirname, './tsconfig/tsconfig.jest.json'),
      },
    ],
  },
};
