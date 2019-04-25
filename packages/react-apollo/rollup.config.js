import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
    input: 'src/index.js',
    external:[
        "@jahia/apollo-dx",
        "apollo-client",
        "lodash",
        "prop-types",
        "graphql-tag",
        "graphql",
        "react",
        "react-apollo"
    ],
    plugins: [
        resolve({
            extensions: [ '.js', '.jsx' ]
        }),
        json(),
    ]
};
