import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import url from 'rollup-plugin-url';

export default {
    input: 'src/index.js',
    external:[
        "lodash",
    ],
    plugins: [
        resolve({
            extensions: [ '.js', '.jsx' ]
        }),
        json(),
        url({
            limit: 100 * 1024,
            include: ["**/*.woff", "**/*.woff2", "**/*.ttf", "**/*.eot"],
            emitFiles: true
        })
    ]
};
