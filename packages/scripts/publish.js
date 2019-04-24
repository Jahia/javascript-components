#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const yarn = require('yarn-api');
const branch = require('git-branch');

var json = require(path.resolve("./package.json"));
var build = json.version;
var branchName = branch.sync();

let params = [];

if (fs.existsSync('build')) {
    params.push('build');
} else {
    params.push('.');
}

var name = 'beta';
if (branchName.startsWith('feature-')) {
    name = branchName.replace(/-/g,'');
    params.push('--tag', name);
}

build += '-' + name + '.' + (new Date()).toISOString().slice(0,19).replace(/[-:T]/g, '');

console.log(build);
params.push('--no-git-tag-version', '--new-version', build);

yarn(['publish', ...params], function (err) {
    if (err) {
        console.error(err);
    }
});
