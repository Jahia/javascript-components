module.exports = {
    moduleNameMapper: {
        '\\.(css|less|woff|woff2|eot|ttf)$': '<rootDir>/node_modules/@jahia/test-framework/__mocks__/styleMock.js'
    },
    setupFilesAfterEnv: [
        '<rootDir>/node_modules/@jahia/test-framework/setupTests.js'
    ],
    testPathIgnorePatterns: [
        '<rootDir>/src/main/',
        '<rootDir>/node/',
        '<rootDir>/node_modules/',
        '<rootDir>/target/'
    ],
    verbose: true
};
