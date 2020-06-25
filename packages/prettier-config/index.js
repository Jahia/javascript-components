'use strict';

module.exports = {
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'none',
    arrowParens: 'avoid',
    "printWidth": 100,
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2
            }
        }
    ]
};
