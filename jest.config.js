module.exports = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    transform: {
        "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tests/tsconfig.json" }],
    },
    testMatch: ["**/*.test.(ts|tsx)"],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    setupFiles: ["./jest.setup.js"],
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
