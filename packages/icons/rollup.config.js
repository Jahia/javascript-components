import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
    input: 'src/index.js',
    external:[
        "@material-ui/core",
        "@material-ui/icons",
        "mdi-material-ui",
        "prop-types",
        "react",
        "recompose"
    ],
    plugins: [
        resolve({
            extensions: [ '.js', '.jsx' ]
        }),
        json(),
    ]
};
