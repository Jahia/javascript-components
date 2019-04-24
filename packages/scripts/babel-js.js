#!/usr/bin/env node
const babel = require('./babel');

console.log('Transpiling for js');

babel('build/js', {
    presets: [
        [
            '@babel/env'
        ],
        '@babel/react'
    ],
    plugins: [
        'lodash'
    ]
});
