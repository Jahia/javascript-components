import {useNodeInfo} from './index.js';
import {print} from 'graphql/language/printer';
import {useQuery} from 'react-apollo';

jest.mock('react-apollo', () => {
    return {
        useQuery: jest.fn(() => ({
            data: {
                jcr: {
                    nodeByPath: {
                        resourceChildren: {
                            nodes: []
                        },
                        site: {
                        }
                    }
                }
            },
            loading: false,
            error: null
        }))
    };
});

jest.mock('react', () => {
    let current;

    return ({
        useRef: v => {
            if (!current) {
                current = v;
            }

            return ({
                current
            });
        },
        useMemo: v => v()
    });
});

describe('useNodeInfo', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should trigger a graphql request with path', () => {
        useNodeInfo({path: '/test', language: 'en'});

        expect(useQuery).toHaveBeenCalled();

        const mock = useQuery.mock;
        const call = mock.calls[mock.calls.length - 1];
        expect(call[1].skip).toBeFalsy();

        const gql = print(call[0]);

        expect(gql).toContain('nodeByPath');

        const variables = call[1].variables;
        call[0].definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(variables.path).toBe('/test');
    });

    it('should trigger a graphql request with multiple paths', () => {
        const paths = ['/test', '/test2'];
        useNodeInfo({paths: paths, language: 'en'});

        expect(useQuery).toHaveBeenCalled();

        const mock = useQuery.mock;
        const call = mock.calls[mock.calls.length - 1];
        expect(call[1].skip).toBeFalsy();

        const gql = print(call[0]);

        expect(gql).toContain('nodesByPath');

        const variables = call[1].variables;
        call[0].definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(variables.paths).toBe(paths);
    });

    it('should not do a query with invalid parameters', () => {
        useNodeInfo({invalidProp: 'xx', language: 'en'});

        const mock = useQuery.mock;
        const call = mock.calls[mock.calls.length - 1];
        expect(call[1].skip).toBeTruthy();
    });

    it('should request a primaryNodeType', () => {
        useNodeInfo({path: '/test', language: 'en', displayLanguage: 'en'}, {getPrimaryNodeType: true});

        expect(useQuery).toHaveBeenCalled();

        const mock = useQuery.mock;
        const call = mock.calls[mock.calls.length - 1];

        const variables = call[1].variables;
        call[0].definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(call[0].definitions.map(d => d.name.value)).toContain('NodeInfoPrimaryNodeType');
    });

    it('should throw an error if a variable is missing', () => {
        expect(() => useNodeInfo({path: '/test'}, {getDisplayName: true})).toThrow();
    });

    it('should request permissions', () => {
        useNodeInfo({path: '/test', language: 'en'}, {getPermissions: ['canRead', 'canWrite']});

        expect(useQuery).toHaveBeenCalled();

        const mock = useQuery.mock;
        const call = mock.calls[mock.calls.length - 1];

        const variables = call[1].variables;
        call[0].definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(call[0].definitions.map(d => d.name.value)).toContain('NodePermission_permission_encoded_Y2FuUmVhZA');
        expect(call[0].definitions.find(d => d.name.value === 'NodePermission_permission_encoded_Y2FuUmVhZA').selectionSet.selections.map(m => m.alias.value)).toContain('permission_encoded_Y2FuUmVhZA');
        expect(call[0].definitions.find(d => d.name.value === 'NodePermission_permission_encoded_Y2FuV3JpdGU').selectionSet.selections.map(m => m.alias.value)).toContain('permission_encoded_Y2FuV3JpdGU');
    });

    it('should request site permissions', () => {
        useNodeInfo({path: '/test', language: 'en'}, {getSitePermissions: ['canRead', 'canWrite']});

        expect(useQuery).toHaveBeenCalled();

        const mock = useQuery.mock;
        const call = mock.calls[mock.calls.length - 1];

        const variables = call[1].variables;
        call[0].definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(call[0].definitions.map(d => d.name.value)).toContain('SiteNodePermission_permission_encoded_Y2FuUmVhZA');
        expect(call[0].definitions.find(d => d.name.value === 'SiteNodePermission_permission_encoded_Y2FuUmVhZA').selectionSet.selections[0].name.value).toBe('site');
        expect(call[0].definitions.find(d => d.name.value === 'SiteNodePermission_permission_encoded_Y2FuUmVhZA').selectionSet.selections[0].selectionSet.selections[1].alias.value).toBe('permission_encoded_Y2FuUmVhZA');
        expect(call[0].definitions.find(d => d.name.value === 'SiteNodePermission_permission_encoded_Y2FuV3JpdGU').selectionSet.selections[0].name.value).toBe('site');
        expect(call[0].definitions.find(d => d.name.value === 'SiteNodePermission_permission_encoded_Y2FuV3JpdGU').selectionSet.selections[0].selectionSet.selections[1].alias.value).toBe('permission_encoded_Y2FuV3JpdGU');
    });

    it('should request isNodeTypes', () => {
        useNodeInfo({path: '/test', language: 'en'}, {getIsNodeTypes: ['jnt:typeA', 'jnt:typeB']});

        expect(useQuery).toHaveBeenCalled();

        const mock = useQuery.mock;
        const call = mock.calls[mock.calls.length - 1];

        const variables = call[1].variables;
        call[0].definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(call[0].definitions.map(d => d.name.value)).toContain('NodeType_nodeType_encoded_am50OnR5cGVB');
        expect(call[0].definitions.find(d => d.name.value === 'NodeType_nodeType_encoded_am50OnR5cGVB').selectionSet.selections.map(m => m.alias.value)).toContain('nodeType_encoded_am50OnR5cGVB');
        expect(call[0].definitions.find(d => d.name.value === 'NodeType_nodeType_encoded_am50OnR5cGVC').selectionSet.selections.map(m => m.alias.value)).toContain('nodeType_encoded_am50OnR5cGVC');
    });

    it('should request properties', () => {
        useNodeInfo({path: '/test', language: 'en'}, {getProperties: ['propA', 'propB']});

        expect(useQuery).toHaveBeenCalled();

        const mock = useQuery.mock;
        const call = mock.calls[mock.calls.length - 1];

        const variables = call[1].variables;
        call[0].definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(call[0].definitions.map(d => d.name.value)).toContain('NodeProperties');
        expect(call[0].definitions.find(d => d.name.value === 'NodeProperties').selectionSet.selections.map(m => m.name.value)).toContain('properties');
    });

    it('should request all data', () => {
        useNodeInfo({path: '/test', language: 'en', displayLanguage: 'en'}, {
            getDisplayName: true,
            getPrimaryNodeType: true,
            getParent: true,
            getAggregatedPublicationInfo: true,
            getOperationSupport: true,
            getPermissions: ['canRead', 'canWrite'],
            getIsNodeTypes: ['jnt:typeA', 'jnt:typeB'],
            getProperties: ['propA', 'propB'],
            getSiteInstalledModules: true,
            getSiteLanguages: true,
            getDisplayableNodePath: true,
            getLockInfo: true,
            getContributeTypesRestrictions: true,
            getSubNodesCount: {types: ['jnt:file']},
            getMimeType: true
        });

        expect(useQuery).toHaveBeenCalled();

        const mock = useQuery.mock;
        const call = mock.calls[mock.calls.length - 1];

        const variables = call[1].variables;
        call[0].definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));
    });
});
