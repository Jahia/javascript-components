'use strict';

module.exports = {
    parser: '@babel/eslint-parser',
    parserOptions: {
        allowImportExportEverywhere: true
    },
    env: {
        browser: true,
        es6: true,
        jest: true
    },
    extends: ['xo', 'xo-react'],
    settings: {
        react: {
            version: '16.8'
        }
    },
    globals: {
        contextJsParameters: false
    },
    plugins: [
        'jest'
    ],
    rules: {
        // ESLint base rules
        indent: [
            'error',
            4,
            {
                ignoredNodes: ['JSXElement *', 'JSXElement'],
                SwitchCase: 1
            }
        ],
        'no-negated-condition': 'warn',
        'no-useless-escape': 'warn',
        camelcase: 'error',
        'comma-dangle': ['error', 'never'],
        'operator-linebreak': ['error', 'after'],
        // React specific rules
        'react/jsx-fragments': 'off',
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 'first'],
        'react/jsx-first-prop-new-line': 0,
        'react/jsx-max-props-per-line': ['error', {
            maximum: 1,
            when: 'multiline'
        }],
        'react/require-default-props': 0,
        'react/static-property-placement': 0,
        'react/state-in-constructor': 0,
        'react/boolean-prop-naming': ['error', {rule: '^((is|has)[A-Z]([A-Za-z0-9]?)+|disabled|readOnly|autoFocus)'}],
        'react/function-component-definition': [
            'error',
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function'
            }
        ],
        'react/jsx-no-useless-fragment': ['error', {allowExpressions: true}],
        'jsx-quotes': [
            'error',
            'prefer-double'
        ]
    }
};
