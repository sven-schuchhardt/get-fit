import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testTimeout: 60000,
  preset: "ts-jest",
  testEnvironment: "node",
};

export default config;
