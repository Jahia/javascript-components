#!/usr/bin/env node
require('dotenv').config();
const {execSync} = require('child_process');
const pack = require('./pack-project');
const {getPackageFilename} = require('./pack-utility');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const deployMethod = process.env.JAHIA_DEPLOY_METHOD;
const packageFileName = getPackageFilename(path.join(process.cwd(), 'package.json'), process.env.npm_package_name, process.env.npm_package_version);
const buildDir = path.resolve('dist/build');
const packDir = fs.existsSync(buildDir) ? path.resolve('dist') : process.cwd();
const packageFilePath = path.join(packDir, packageFileName);

if (!fs.existsSync(packageFileName)) {
    console.log('Package hasn\'t been built previously, packing now using jahia-pack...');
    pack();
} else if (args.length > 0 && args[0] === 'pack') {
    console.log('Forced packing is active, packing...');
    pack();
}

if (deployMethod === 'curl') {
    console.log('Deploying URL curl to Jahia bundles REST API...');
    console.log(execSync(`curl -s --user ${process.env.JAHIA_USER} --form bundle=@${packageFilePath} --form start=true ${process.env.JAHIA_HOST}/modules/api/bundles`, {encoding: 'utf8'}));
} else {
    console.log('Deploying using Docker copy...');
    console.log(execSync(`docker cp ${packageFilePath} ${process.env.JAHIA_DOCKER_NAME}:/var/jahia/modules`, {encoding: 'utf8'}));
}
