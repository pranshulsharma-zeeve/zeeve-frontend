/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.jest.json" }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@zeeve-platform/ui|@zeeve-platform/ui-common-components|@zeeve-platform/icons)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@orbit/(.*)$": "<rootDir>/src/modules/arbitrum-orbit/$1",
    "^@zeeve-platform/icons/(.*)$": "<rootDir>/test/__mocks__/iconsMock.js",
    "\\.(css|less|scss|sass)$": "<rootDir>/test/__mocks__/styleMock.ts",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/__mocks__/fileMock.ts",
  },
};

module.exports = config;
