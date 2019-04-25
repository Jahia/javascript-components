import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
    input: 'build/esm/index.js',
    external: [
        'lodash',
        'i18next',
        'i18next-xhr-backend',
        'i18next-chained-backend',
    ],
    plugins: [
        resolve({
            extensions: ['.js', '.jsx']
        }),
        json()
    ]
};
