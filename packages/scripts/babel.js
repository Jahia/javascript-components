#!/usr/bin/env node
const babel = require('@babel/core');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const fx = require('mkdir-recursive');

// "babel": "../../node_modules/.bin/cross-env NODE_ENV=production ../../node_modules/.bin/babel ./src --ignore *.test.js --out-dir ./build",
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

        try {
            fs.writeFileSync(target, result.code);
            console.log('Transpiled file ' + target);
        } catch (err) {
            console.log(err);
        }
    });
}

module.exports = transform;
