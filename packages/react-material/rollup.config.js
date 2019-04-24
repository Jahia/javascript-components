import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import url from 'rollup-plugin-url';
import glob from 'glob';
import path from 'path';

export default {
    input: 'build/esm/index.js',
    output: {
        file: 'build/lib/react-material.umd.js',
        format: 'umd',
        name:'jahia.reactmaterial',
        sourcemap: true,
        globals: {
            "@jahia/apollo-dx": "jahia.apollodx",
            "lodash": "_",
            "material-ui/styles":"materialUiStyles"
        }
    },
    external:[
        "@jahia/icons",
        "@jahia/ds-mui-theme",
        "lodash",
        "@material-ui/core",
        "@material-ui/icons",
        "mdi-material-ui",
        "@jahia/apollo-dx",
        "classnames",
        "graphql-tag",
        "prop-types",
        "recompose",
        "react",
        "react-apollo",
        "react-dom",
        "react-file-viewer",
        "react-flexbox-grid",
        "react-i18next",
        "react-jss",
        "react-pdf-js",
        "react-redux",
        "react-router",
        "react-router-dom",
        "react-select",
        "rxjs",
        "rxjs/operators"
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
