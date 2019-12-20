#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const glob = require('glob');

console.log('Preparing build folder');

function mkdirs(dir) {
    if (!fs.existsSync(dir)) {
        let parent = path.resolve(dir, '..');
        mkdirs(parent);
        fs.mkdirSync(dir);
    }
}

function copyFile(srcFolder, destFolder, file, newFile) {
    let source = path.resolve(srcFolder, file);
    if (fs.lstatSync(source).isFile()) {
        newFile = newFile || file;
        let target = path.resolve(destFolder, newFile);
        mkdirs(path.resolve(target, '..'));
        fs.createReadStream(source).pipe(fs.createWriteStream(target));
        console.log(`Copied ${source} to ${target}`);
    }
}

function typingsCopy() {
    // Create index.d.ts
    glob.sync('**/index.js', {cwd: 'src'}).forEach(file => {
        copyFile('src', 'build/esm', file, file.slice(0, -3) + '.d.ts');
    });

    glob.sync('**/*.d.ts', {cwd: 'src'}).forEach(file => {
        copyFile('src', 'build/esm', file);
    });

    glob.sync('**', {cwd: 'resources'}).forEach(file => {
        copyFile('resources', 'build/resources', file);
    });
}

copyFile('.', 'build', 'README.md');
copyFile('.', 'build', 'package.json');
typingsCopy();
