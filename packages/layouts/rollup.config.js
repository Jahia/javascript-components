import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
    input: 'src/index.js',
    external: [
        '@jahia/react-material',
        '@material-ui/core',
        '@material-ui/icons',
        'classnames',
        'lodash',
        'react',
        'react-i18next',
        'recompose',
        'rxjs',
        'prop-types'
    ],
    plugins: [
        resolve({
            extensions: ['.js', '.jsx']
        }),
        json(),
    ]
};
