/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    coverageDirectory: "coverage",
    collectCoverage: false,
    collectCoverageFrom: ["src/**/*.{ts,tsx}"],
    setupFiles: ["<rootDir>/jest.setup.ts"],
};
