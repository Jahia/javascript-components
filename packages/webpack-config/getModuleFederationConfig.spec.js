import getModuleFederationConfig from './getModuleFederationConfig';

const packageJson = {
    name: '@jahia/test-name',
    version: '1.0.0',
    description: 'Webpack shareable config for Jahia project',
    main: 'index.js',
    license: 'MIT',
    dependencies: {
        react: '^16',
        dayjs: '1.8.21'
    }
};

describe('getModuleFederationConfig', () => {
    it('should create base config', () => {
        const config = getModuleFederationConfig(packageJson);
        expect(config.name).toBe('testName');
        expect(config.library.name).toBe('appShell.remotes.testName');
        expect(config.shared.react.requiredVersion).toBe(packageJson.dependencies.react);
        expect(config.shared.react.import).toBe(false);
        expect(config.shared.react.singleton).toBe(true);
        expect(config.shared.dayjs.requiredVersion).toBe(packageJson.dependencies.dayjs);
        expect(config.shared.dayjs.import).toBe(false);
        expect(config.shared.dayjs.singleton).toBe(undefined);
        expect(config.exposes['./init']).toBe('./src/javascript/init');
        expect(config.remotes['@jahia/app-shell']).toBe('appShellRemote');
    });

    it('should take custom config', () => {
        const config = getModuleFederationConfig(packageJson, {name: 'customName'});
        expect(config.name).toBe('customName');
    });

    it('should accept import', () => {
        const config = getModuleFederationConfig(packageJson, {}, ['react', 'dayjs']);
        expect(config.shared.react.requiredVersion).toBe(packageJson.dependencies.react);
        expect(config.shared.react.import).toBe(undefined);
        expect(config.shared.react.singleton).toBe(true);
        expect(config.shared.dayjs.requiredVersion).toBe(packageJson.dependencies.dayjs);
        expect(config.shared.dayjs.import).toBe(undefined);
        expect(config.shared.dayjs.singleton).toBe(undefined);
    });

    it('should accept additional remotes and exposes', () => {
        const config = getModuleFederationConfig(packageJson, {
            exposes: {
                '.': './src/javascript/shared'
            },
            remotes: {
                '@jahia/jcontent': 'appShell.remotes.jcontent',
                '@jahia/jahia-ui-root': 'appShell.remotes.jahiaUi'
            }
        }, []);
        expect(config.exposes['./init']).toBe('./src/javascript/init');
        expect(config.exposes['.']).toBe('./src/javascript/shared');
        expect(config.remotes['@jahia/app-shell']).toBe('appShellRemote');
        expect(config.remotes['@jahia/jcontent']).toBe('appShell.remotes.jcontent');
        expect(config.remotes['@jahia/jahia-ui-root']).toBe('appShell.remotes.jahiaUi');
    });

    it('should accept additional shared libs', () => {
        const config = getModuleFederationConfig(packageJson, {
            shared: {
                myLib: '^1.0.0'
            }
        }, []);
        expect(config.shared.react.requiredVersion).toBe(packageJson.dependencies.react);
        expect(config.shared.react.import).toBe(false);
        expect(config.shared.react.singleton).toBe(true);
        expect(config.shared.react.requiredVersion).toBe(packageJson.dependencies.react);
        expect(config.shared.react.import).toBe(false);
        expect(config.shared.myLib).toBe('^1.0.0');
    });
});
