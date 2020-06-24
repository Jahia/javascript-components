'use strict';

module.exports = {
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'none',
    arrowParens: 'avoid',
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2
            }
        }
    ]
};
