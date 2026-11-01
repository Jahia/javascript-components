import {ModuleFederation} from '@module-federation/runtime-core';
import {afterEach, describe, expect, it, vi} from 'vitest';
import FederationWindowPlugin from './federation-window-plugin.js';

/** A webpack container, which accepts one share scope only. */
function webpackContainer(modules: Record<string, unknown>) {
    let scope: unknown;
    return {
        init: vi.fn((shareScope: unknown) => {
            if (scope && scope !== shareScope) {
                throw new Error('Container initialization failed as it has already been initialized with a different share scope');
            }

            scope = shareScope;
        }),
        get: vi.fn(async (id: string) => () => modules[id])
    };
}

function loadEntry(remoteInfo: {type: string; entry: string}) {
    return FederationWindowPlugin().loadEntry!({remoteInfo} as any);
}

describe('FederationWindowPlugin', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('hands the container with an init that does nothing', async () => {
        const container = webpackContainer({'.': 'jcontent'});
        vi.stubGlobal('window', {appShell: {remotes: {jcontent: container}}});

        const entry = await loadEntry({type: 'var', entry: 'window:appShell.remotes.jcontent'});
        await entry!.init({});
        const factory = await entry!.get('.');

        expect(container.init).not.toHaveBeenCalled();
        expect(container.get).toHaveBeenCalledWith('.');
        expect(factory()).toBe('jcontent');
    });

    it('reads the get of the container on each call', async () => {
        // The remoteEntry.js of a Vite module only adds `get` in `init`
        const container: {get?: (id: string) => unknown} = {};
        vi.stubGlobal('window', {appShell: {remotes: {vite: container}}});

        const entry = await loadEntry({type: 'var', entry: 'window:appShell.remotes.vite'});
        container.get = () => () => 'vite';

        expect(entry!.get('.')()).toBe('vite');
    });

    it('ignores the other remotes', async () => {
        vi.stubGlobal('window', {appShell: {remotes: {}}});

        await expect(loadEntry({type: 'module', entry: 'window:appShell.remotes.jcontent'})).resolves.toBeUndefined();
        await expect(loadEntry({type: 'var', entry: 'https://example.com/remoteEntry.js'})).resolves.toBeUndefined();
        await expect(loadEntry({type: 'var', entry: 'window:appShell.remotes.missing'})).resolves.toBeUndefined();
    });

    it('shares with the version-first strategy a container the app shell has initialized', async () => {
        const container = webpackContainer({'.': {name: 'jcontent'}});
        container.init({}); // The app shell initializes it with its own share scope
        vi.stubGlobal('window', {appShell: {remotes: {jcontentInitialized: container}}});

        const federation = new ModuleFederation({
            name: 'module',
            remotes: [{name: '@jahia/jcontent', entry: 'window:appShell.remotes.jcontentInitialized', type: 'var'}],
            shared: {},
            shareStrategy: 'version-first',
            plugins: [FederationWindowPlugin()]
        });

        await expect(Promise.all(federation.initializeSharing('default'))).resolves.toBeDefined();
        await expect(federation.loadRemote('@jahia/jcontent')).resolves.toEqual({name: 'jcontent'});
        expect(container.init).toHaveBeenCalledTimes(1);
    });
});
