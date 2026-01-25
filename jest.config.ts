import type { Config } from "jest"
import nextJest from "next/jest"

const createJestConfig = nextJest({
  dir: "./",
})

const config: Config = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/fileMock.js",

    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/tests/e2e"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  watchPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/", // se for um projeto Next.js
    "<rootDir>/dist/",
  ],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
}

export default createJestConfig(config)
