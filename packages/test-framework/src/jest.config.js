module.exports = {
    moduleNameMapper: {
        '\\.(css|less|woff|woff2|eot|ttf|svg)$': '<rootDir>/node_modules/@jahia/test-framework/build/js/__mocks__/styleMock.js',
        '^react-i18next$': '<rootDir>/node_modules/@jahia/test-framework/build/js/__mocks__/react-i18next.js',
        '\\.(css|scss)$': 'identity-obj-proxy',
        '~/(.*)': '<rootDir>/src/javascript/$1',
        '@jahia/moonstone': '@jahia/moonstone/dist/lib/main'
    },
    setupFilesAfterEnv: [
        '<rootDir>/node_modules/@jahia/test-framework/build/js/setupTests.js'
    ],
    testPathIgnorePatterns: [
        '<rootDir>/src/main/',
        '<rootDir>/node/',
        '<rootDir>/node_modules/',
        '<rootDir>/target/'
    ],
    verbose: true
};
