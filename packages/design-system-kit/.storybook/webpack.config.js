module.exports = function({ config }) {
    config.module.rules.push({
        test: /\.stories\.jsx?$/,
        enforce: 'pre',
    });

    return config;
};
