export default {
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$",
    transform: {
        "^.+\\.(js|jsx|mjs)$": "babel-jest"
    },
    testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
    moduleFileExtensions: ["js", "jsx", "mjs"]
};