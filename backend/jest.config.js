export default {
    testEnvironment: 'node',
    transform: {
        "^.+\\.(js|jsx|mjs)$": "babel-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$",
    testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
    moduleFileExtensions: ["js", "jsx", "mjs"],
    extensionsToTreatAsEsm: ['.mjs'], // Removed .js as it's inferred
    transformIgnorePatterns: [
        'node_modules/(?!(module-that-needs-to-be-transformed)/)'
    ],
    verbose: true,
    detectOpenHandles: true,
    forceExit: true
};