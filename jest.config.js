module.exports = {
    setupFilesAfterEnv: [
        '<rootDir>/jest.setup.js'
    ],
    transform: {
        '^.+\\.jsx?$': 'babel-jest'
    },
    moduleNameMapper: {
        '\\.(gif|ttf|woff|woff2|eot|eot|svg)$': '<rootDir>/__mocks__/fileMock.js'
    },
    testPathIgnorePatterns: [
        'build/',
        'node_modules/',
        'target/',
        'node'
    ]
};
