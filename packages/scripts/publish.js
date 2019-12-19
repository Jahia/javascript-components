#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const branch = require('git-branch');
const spawn = require('cross-spawn');

const json = require(path.resolve('./package.json'));
const branchName = branch.sync();

let projectName = json.name.substring(json.name.lastIndexOf('/') + 1);
let build = json.version;
let tag = projectName + '-v' + build;
let previous = 'design-system-kit-v1.0.0';
let buildPath = fs.existsSync('build/package.json') ? 'build' : '.';

const spawnSync = (command, params, options) => {
    let subprocess = spawn.sync(command, params, options);
    if (subprocess.status !== 0) {
        if (subprocess.stdout) {
            console.log(subprocess.stdout.toString('ascii'));
        }

        if (subprocess.stderr) {
            console.log('ERROR : ' + subprocess.stderr.toString('ascii'));
        }

        process.exit(subprocess.status);
    }

    return subprocess;
};

console.log('Releasing code from branch : ' + branchName + ' to ' + tag);

// Ensure code is called from master
// if (branchName !== 'master') {
//     console.log('Can only release from master branch');
//     process.exit(1);
// }

// Handle canary branches
// let name = 'beta';
// if (branchName.startsWith('feature-')) {
//     name = branchName.replace(/-/g, '');
//     params.push('--tag', name);
// }
//
// build += '-' + name + '.' + (new Date()).toISOString().slice(0, 19).replace(/[-:T]/g, '');

// Generate changelog
spawnSync('yarn', ['auto', 'changelog', '--from', previous]);

// Bump version
let autoVersionProcess = spawnSync('yarn', ['auto', 'version', '--from', previous]);
const result = autoVersionProcess.stdout.toString('ascii').split(/\r?\n/);
const versionChange = result[1];

if (versionChange !== 'patch' && versionChange !== 'minor' && versionChange !== 'major') {
    console.log('No new version detected');
    process.exit(0);
}

console.log('Auto version change : ' + versionChange);
spawnSync('npm', ['version', versionChange, '-m', 'Bump version to: %s [skip ci]']);

// Publish
spawnSync('npm', ['publish', buildPath]);

// Push to repository
spawnSync('git', ['push', '--follow-tags']);

// Do git release
// spawnSync('yarn', ['auto', 'release', '--from', previous]);

console.log('Done');
