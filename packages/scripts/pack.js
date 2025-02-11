#!/usr/bin/env node
/**
 * @deprecated Use `yarn pack --out package.tgz` instead. The renaming (to include the module name & version) is done by the CI.
 */
const pack = require('./pack-project');
pack();
