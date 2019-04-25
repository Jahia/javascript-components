import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
    input: 'src/index.js',
    external:[
        "lodash",
        "redux",
    ],
    plugins: [
        resolve({
            extensions: [ '.js', '.jsx' ]
        }),
        json(),
    ]
};
