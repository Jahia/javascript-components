const fs = require('fs');

/**
 * @deprecated No longer needed as the packing should be done with `yarn pack --out package.tgz` directly instead
 */
function getPackageFilename(packageJsonPath, packageName, packageVersion) {
    const packageJsonContent = fs.readFileSync(packageJsonPath, { encoding: 'utf8' });
    const packageJson = JSON.parse(packageJsonContent);
    const cleanPackageName = packageName.replace(/@/g, '').replace(/\//g, '-');
    const snapshotUsed = packageJson?.jahia?.snapshot?.toString().toLowerCase() === 'true';
    return `${cleanPackageName}-v${packageVersion}${snapshotUsed ? '-SNAPSHOT' : ''}.tgz`;
}
module.exports = { getPackageFilename };
