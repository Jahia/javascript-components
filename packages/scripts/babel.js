#!/usr/bin/env node
const babel = require('@babel/core');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const fx = require('mkdir-recursive');

function transform(buildFolder, conf) {
    const files = [
        ...glob.sync('**/*.js', {ignore: '**/*.test.js', cwd: 'src'}),
        ...glob.sync('**/*.jsx', {ignore: '**/*.test.jsx', cwd: 'src'}),
        ...glob.sync('**/*.ts', {ignore: ['**/*.test.ts', '**/*.d.ts'], cwd: 'src'}),
        ...glob.sync('**/*.tsx', {ignore: '**/*.test.tsx', cwd: 'src'})
    ];

    files.forEach(file => {
        const result = babel.transformFileSync(path.resolve('src', file), conf);

        const target = path.resolve(buildFolder, file).replace(/\.[tj]sx?$/, '.js');
        const folder = path.resolve(target, '..');

        if (!fs.existsSync(folder)) {
            fx.mkdirSync(folder);
        }

        if (result.map) {
            result.code += '\n' + result.map.sources.map(m => '//# sourceMappingURL=' + m.replace(/\.[tj]sx?$/, '.js') + '.map\n');
        }

        fs.writeFileSync(target, result.code);
        fs.writeFileSync(target + '.map', JSON.stringify(result.map));

        console.log('Transpiled file ' + target);
    });
}

module.exports = transform;
