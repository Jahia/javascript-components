const camelCase = require('camelcase').default;

const sharedDeps = [
    '@babel/polyfill',
    '@material-ui/core',
    'react',
    'react-dom',
    'react-router',
    'react-router-dom',
    'react-i18next',
    'i18next',
    'i18next-xhr-backend',
    'graphql-tag',
    'react-apollo',
    'react-dnd',
    'react-dnd-html5-backend',
    'react-redux',
    'redux',
    'rxjs',
    'whatwg-fetch',
    'dayjs',

    // JAHIA PACKAGES
    '@jahia/ui-extender',
    '@jahia/moonstone',
    '@jahia/moonstone-alpha',
    '@jahia/data-helper',

    // Apollo
    '@apollo/react-common',
    '@apollo/react-components',
    '@apollo/react-hooks',

    // DEPRECATED JAHIA PACKAGES
    '@jahia/design-system-kit',
    '@jahia/react-material',
    '@jahia/icons',

    // Content-editor specific
    'formik'
];

const singletonDeps = [
    'react',
    'react-dom',
    'react-router',
    'react-router-dom',
    'react-i18next',
    'i18next',
    'react-apollo',
    'react-dnd',
    'react-dnd-html5-backend',
    'react-redux',
    'redux',
    '@jahia/moonstone',
    '@jahia/ui-extender',
    '@apollo/react-common',
    '@apollo/react-components',
    '@apollo/react-hooks',
    'formik'
];

var getModuleFederationConfig = (packageJson, config = {}, importList = []) => {
    const deps = packageJson.dependencies;
    const shared = sharedDeps.filter(item => deps[item]).reduce((acc, item) => ({
        ...acc,
        [item]: {
            requiredVersion: deps[item],
            import: false
        }
    }), config.shared || {});

    singletonDeps.filter(item => shared[item]).forEach(item => {
        shared[item].singleton = true;
    });

    importList.filter(item => shared[item]).forEach(item => {
        delete shared[item].import;
    });

    const name = config.name || camelCase((packageJson.name.indexOf('/') > 0) ? packageJson.name.substring(packageJson.name.indexOf('/') + 1) : packageJson.name);

    return {
        ...config,
        name,
        library: config.library || {type: 'assign', name: 'appShell.remotes.' + name},
        filename: config.filename || 'remoteEntry.js',
        exposes: {
            './init': './src/javascript/init',
            ...config.exposes
        },
        remotes: {
            '@jahia/app-shell': 'appShellRemote',
            ...config.remotes
        },
        shared
    };
};

module.exports = getModuleFederationConfig;
// TODO: Remove this for the next major release
module.exports.default = getModuleFederationConfig;
