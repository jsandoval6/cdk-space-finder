import { Config } from '@jest/types';

const baseTestDirectory: string = '<rootDir>/test/infra'

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        `${baseTestDirectory}/**/*.test.ts`
    ]
};

export default config;