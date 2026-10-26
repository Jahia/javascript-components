import {describe, expect, it} from 'vitest';
import {getShared} from './shared.js';

describe('getShared', () => {
    it('shares peerDependencies as host singletons and dependencies as pooled', () => {
        expect(
            getShared({
                dependencies: {'@apollo/client': '^3.8.0'},
                peerDependencies: {'react-redux': '^7.2.0'}
            })
        ).toEqual({
            '@apollo/client': {requiredVersion: '^3.8.0'},
            'react-redux': {
                singleton: true,
                import: false,
                requiredVersion: '^7.2.0'
            }
        });
    });

    it('drops ranges using a Yarn protocol', () => {
        expect(
            getShared({
                dependencies: {'my-lib': 'workspace:^'},
                peerDependencies: {'@jahia/ui-extender': 'npm:^2.0.0'}
            })
        ).toEqual({
            'my-lib': {},
            '@jahia/ui-extender': {singleton: true, import: false}
        });
    });

    it('configures React subpaths', () => {
        const shared = getShared({
            peerDependencies: {react: '^18.0.0', 'react-dom': '^18.0.0'}
        });
        expect(shared['react/jsx-runtime']).toBe(shared.react);
        expect(shared['react/jsx-dev-runtime']).toBe(shared.react);
        expect(shared['react-dom/client']).toBe(shared['react-dom']);
    });

    it('merges overrides last', () => {
        expect(
            getShared(
                {peerDependencies: {react: '^18.0.0'}},
                {react: {singleton: true}}
            ).react
        ).toEqual({singleton: true});
    });

    it('throws when a host singleton is declared in dependencies', () => {
        expect(() =>
            getShared({
                dependencies: {
                    react: '^18.0.0',
                    'react-dom': '^18.0.0',
                    clsx: '^2.0.0'
                }
            })
        ).toThrowErrorMatchingInlineSnapshot(
            '[Error: The following libraries are provided by the host as singletons, move them from `dependencies` to `peerDependencies`: react, react-dom]'
        );
    });

    it('throws when a host singleton is only declared in devDependencies', () => {
        expect(() =>
            getShared({
                devDependencies: {react: '^18.0.0', 'react-dom': '^18.0.0', vite: '^6.0.0'},
                peerDependencies: {'react-dom': '^18.0.0'}
            })
        ).toThrowErrorMatchingInlineSnapshot(
            '[Error: The following libraries are provided by the host as singletons, add them to `peerDependencies`: react]'
        );
    });

    it('throws when a peerDependency is not provided by the host', () => {
        expect(() =>
            getShared({peerDependencies: {react: '^18.0.0', lodash: '^4.0.0'}})
        ).toThrowErrorMatchingInlineSnapshot(
            '[Error: The following libraries are not provided by the host as singletons, move them from `peerDependencies` to `dependencies` or `devDependencies`: lodash]'
        );
    });

    it('skips the checks for libraries configured explicitly', () => {
        expect(
            getShared(
                {
                    dependencies: {react: '^18.0.0'},
                    peerDependencies: {'react-router-dom': '^6.0.0'}
                },
                {
                    react: {singleton: true},
                    'react-router-dom': {singleton: true, import: false}
                }
            )
        ).toMatchObject({
            react: {singleton: true},
            'react-router-dom': {singleton: true, import: false}
        });
    });
});
