export default {
    testEnvironment: 'node',
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?)$",
    testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
    moduleFileExtensions: ["js", "jsx"],
    transformIgnorePatterns: [
        'node_modules/(?!(module-that-needs-to-be-transformed)/)'
    ],
    verbose: true,
    detectOpenHandles: true,
    forceExit: true
};