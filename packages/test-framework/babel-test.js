#!/usr/bin/env node
const babel = require('../scripts/babel');

console.log('Transpiling for js');

const testIgnore = [
    // Remove __mocks__/** from the default ignore list
    '__storybook__/**',
    '**/*.test.[tj]s',
    '**/*.spec.[tj]s',
    '**/*.test.[tj]sx',
    '**/*.spec.[tj]sx',
    '**/*.stories.[tj]sx',
    '**/*.d.ts'
];

babel('build/js', {
    presets: [['@babel/env'], '@babel/react'],
    sourceMaps: true,
    plugins: ['lodash', '@babel/plugin-syntax-dynamic-import', '@jahia/scripts/dynamic-to-static']
}, testIgnore);
