import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import url from 'rollup-plugin-url';

export default {
    input: 'build/esm/index.js',
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
