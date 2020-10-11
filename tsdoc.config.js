module.exports = {
  rootDir: process.cwd(),
  packagesDir: "packages/",
  scanPatterns: [
    "<rootDir>/packages/**/lib/**/*.d.ts",
    "!<rootDir>/packages/**/lib/**/data/*.ts",
    "!**/*.spec.ts",
    "!**/mvc/utils/**",
    "!**/mvc/constants/**",
    "!**/jsonschema/**",
    "!<rootDir>/packages/*/src",
    "!<rootDir>/packages/**/constants",
    "!<rootDir>/packages/**/registries",
    "!<rootDir>/packages/**/platform/utils",
    "!<rootDir>/packages/**/platform-builder/utils",
    "!<rootDir>/packages/seq",
    "!<rootDir>/packages/testing",
    "!<rootDir>/packages/platform-test-utils",
    "!**/node_modules"
  ],
  outputDir: "<rootDir>/docs/api",
  baseUrl: "/api",
  jsonOutputDir: "<rootDir>/docs/.vuepress/public",
  scope: "@tsed",
  modules: {
    core: "core",
    di: "di",
    common: "common",
    exceptions: "exceptions",
    ajv: "ajv",
    mongoose: "mongoose",
    multipartfiles: "multipartfiles",
    passport: "passport",
    servestatic: "servestatic",
    socketio: "socketio",
    swagger: "swagger",
    typeorm: "typeorm",
    testing: "testing"
  }
};
