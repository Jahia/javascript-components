#!/usr/bin/env node
const babel = require('./babel');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const fx = require('mkdir-recursive');

console.log('Transpiling for esm');

babel('build/esm', {
    presets: [
        [
            '@babel/env',
            {modules: false}
        ],
        '@babel/react'
    ],
    plugins: [
        'lodash'
    ]
});
