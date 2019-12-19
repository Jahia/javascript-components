#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const branch = require('git-branch');
const spawn = require('cross-spawn');

const json = require(path.resolve('./package.json'));
const branchName = branch.sync();

let projectName = json.name.substring(json.name.lastIndexOf('/') + 1);
let previous = projectName + '-v' + json.version;
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

console.log('Releasing code from branch : ' + branchName);

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
const autoVersionProcess = spawnSync('yarn', ['auto', 'version', '--from', previous]);
const versionChange = autoVersionProcess.stdout.toString('ascii').split(/\r?\n/)[1];

if (versionChange !== 'patch' && versionChange !== 'minor' && versionChange !== 'major') {
    console.log('No new version detected');
    process.exit(0);
}

console.log('Auto version change : ' + versionChange);
const npmVersionProcess = spawnSync('npm', ['version', versionChange]);
const newVersion = npmVersionProcess.stdout.toString().split(/\r?\n/)[0];
let tag = projectName + '-' + newVersion;
console.log('Will release ' + tag);

spawnSync('git', ['add', 'package.json']);
spawnSync('git', ['commit', '-n', '-m', 'Bump ' + projectName + ' version to: ' + newVersion + ' [skip ci]']);

console.log('Publishing ..');

// Publish
spawnSync('npm', ['publish', buildPath]);

// Push to repository
spawnSync('git', ['push', '--no-verify', '--follow-tags']);

// Do git release
spawnSync('yarn', ['auto', 'release', '--use-version', tag, '--from', previous]);

console.log('Done');
