import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
    input: 'src/index.js',
    external:[
        "apollo-cache-inmemory",
        "apollo-client",
        "apollo-link",
        "apollo-link-batch-http",
        "apollo-link-http",
        "apollo-utilities",
        "graphql",
        "graphql-tag",
        "lodash",
        "zen-observable"
    ],
    plugins: [
        resolve({
            extensions: [ '.js', '.jsx' ]
        }),
        json(),
    ]
};
