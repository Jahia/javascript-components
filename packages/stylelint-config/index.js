'use strict';

const basicsRules = require('./rules/basicsRules.js');
const orderTypes = require('./rules/orderTypes.js');
const orderProperties = require('./rules/orderProperties.js');
const scssRules = require('./rules/scssRules.js');

module.exports = {
    extends: ['stylelint-config-standard', 'stylelint-config-css-modules', 'stylelint-config-prettier'],
    plugins: ['stylelint-scss', 'stylelint-order'],
    ignoreFiles: [
        '**/*.jsx'
    ],
    rules: {
        ...orderTypes,
        ...orderProperties,
        ...basicsRules,
        ...scssRules
    }
};
