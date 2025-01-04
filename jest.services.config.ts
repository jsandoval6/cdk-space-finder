import { Config } from '@jest/types';

const baseTestDirectory: string = '<rootDir>/src/test/services'

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        `${baseTestDirectory}/**/*.test.ts`
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Map '@/' to the 'src' directory
    },
};

export default config;