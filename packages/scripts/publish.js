#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const yarn = require('yarn-api');
const branch = require('git-branch');
const util = require('util');

const json = require(path.resolve('./package.json'));
const branchName = branch.sync();

let build = json.version;

let params = [];

if (fs.existsSync('build')) {
    params.push('build');
} else {
    params.push('.');
}

let name = 'beta';
if (branchName.startsWith('feature-')) {
    name = branchName.replace(/-/g, '');
    params.push('--tag', name);
}

build += '-' + name + '.' + (new Date()).toISOString().slice(0, 19).replace(/[-:T]/g, '');

console.log(build);
params.push('--no-git-tag-version', '--new-version', build);

const yarnPromise = util.promisify(yarn);

async function yarnSync(params) {
    let filePath = path.join('.', params[1], 'package.json');
    let previous = fs.readFileSync(filePath);

    let d = await yarnPromise(params);
    if (branchName.startsWith('feature-')) {
        await yarnPromise(['tag', 'add', json.name + '@' + build, name]);
    }

    fs.writeFileSync(filePath, previous);

    return d;
}

yarnSync(['publish', ...params]);
