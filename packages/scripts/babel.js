#!/usr/bin/env node
const babel = require('@babel/core');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const fx = require('mkdir-recursive');

function transform(buildFolder, conf) {
    const files = [...glob.sync('**/*.js', {
        ignore: '*.test.js',
        cwd: 'src'
    }), ...glob.sync('**/*.jsx', {ignore: '*.test.jsx', cwd: 'src'})];

    files.forEach(file => {
        let result = babel.transformFileSync(path.resolve('src', file), conf);

        let target = path.resolve(buildFolder, file);
        let folder = path.resolve(target, '..');

        if (!fs.existsSync(folder)) {
            fx.mkdirSync(folder);
        }

        fs.writeFileSync(target, result.code);
        console.log('Transpiled file ' + target);
    });
}

module.exports = transform;
