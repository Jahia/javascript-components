const {execSync} = require('child_process');
const semver = require('semver');
const path = require('path');
const {getPackageFilename} = require('./pack-utility');
const fs = require('fs');

function pack() {
    console.log('Node version detected:', process.versions.node);
    const yarnVersion = execSync('yarn --version', {encoding: 'utf8'});
    console.log('Yarn version:', yarnVersion);
    const buildDir = path.resolve('dist/build');
    const packDir = fs.existsSync(buildDir) ? buildDir : process.cwd();
    console.log(`Packing folder ${packDir}...`);

    if (semver.satisfies(yarnVersion, '1.x')) {
        console.log('Yarn Classic detected');
        console.log(execSync('yarn pack', {encoding: 'utf8'}));
    } else if (semver.gte(yarnVersion, '2.0.0')) {
        console.log('Yarn Berry detected');
        const outputFileName = getPackageFilename(path.join(process.cwd(), 'package.json'), process.env.npm_package_name, process.env.npm_package_version);
        console.log(execSync(`cd ${packDir} && yarn pack --out ${outputFileName} && mv ${outputFileName} ..`, {encoding: 'utf8'}));
    }
}

module.exports = pack;
