/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ["./src"],
  preset: "ts-jest",
  testEnvironment: "node",
  maxWorkers: 4,
  globalSetup: "./src/utils/globalSetup.ts",
  globalTeardown: "./src/utils/globalTeardown.ts",
};
