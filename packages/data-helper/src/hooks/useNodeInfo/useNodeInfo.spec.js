import {useNodeInfo} from './useNodeInfo';
import {getQuery} from './useNodeInfo.gql-queries';
import React from 'react';

const wait = (time = 1000) => new Promise(resolve => {
    setTimeout(resolve, time);
});

jest.mock('react-apollo', () => {
    const data = {
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
    };

    return {
        useQuery: jest.fn(() => (data)),
        useApolloClient: jest.fn(() => ({
            query: () => ({
                then: inputFcn => inputFcn(data)
            }),
            watchQuery: () => ({
                subscribe(inputFcn) {
                    inputFcn(data);
                    return {
                        unsubscribe() {
                            //
                        }
                    };
                }
            })
        }))
    };
});

jest.mock('react', () => {
    let current;

    return ({
        useRef(v) {
            if (!current) {
                current = v;
            }

            return ({
                current
            });
        },
        useMemo: v => v(),
        useState: v => v,
        useEffect: v => v()
    });
});

jest.mock('./useNodeInfo.gql-queries', () => {
    const original = jest.requireActual('./useNodeInfo.gql-queries');
    return {
        getQuery: jest.fn(original.getQuery),
        validOptions: original.validOptions
    };
});

describe('useNodeInfo', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should not do a query with invalid parameters', async () => {
        const setStateMock = jest.fn();
        const useStateMock = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        useNodeInfo({invalidProp: 'xx', language: 'en'});

        await wait();

        expect(getQuery).toHaveBeenCalled();
        const {mock} = getQuery;
        const result = mock.results[mock.results.length - 1];
        expect(result.value.skip).toBeTruthy();
    });

    it('should request a primaryNodeType', async () => {
        const setStateMock = jest.fn();
        const useStateMock = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        useNodeInfo({path: '/test', language: 'en', displayLanguage: 'en'}, {getPrimaryNodeType: true});

        await wait();

        expect(getQuery).toHaveBeenCalled();
        const {mock} = getQuery;
        const result = mock.results[mock.results.length - 1];
        const variables = result.value.generatedVariables;
        result.value.query.definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(result.value.query.definitions.map(d => d.name.value)).toContain('NodeInfoPrimaryNodeType');
    });

    it('should request permissions', async () => {
        const setStateMock = jest.fn();
        const useStateMock = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        useNodeInfo({path: '/test', language: 'en'}, {getPermissions: ['canRead', 'canWrite']});

        await wait();

        expect(getQuery).toHaveBeenCalled();
        const {mock} = getQuery;
        const result = mock.results[mock.results.length - 1];
        const variables = result.value.generatedVariables;
        result.value.query.definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(result.value.query.definitions.map(d => d.name.value)).toContain('NodePermission_permission_encoded_Y2FuUmVhZA');
        expect(result.value.query.definitions.find(d => d.name.value === 'NodePermission_permission_encoded_Y2FuUmVhZA').selectionSet.selections.map(m => m.alias.value)).toContain('permission_encoded_Y2FuUmVhZA');
        expect(result.value.query.definitions.find(d => d.name.value === 'NodePermission_permission_encoded_Y2FuV3JpdGU').selectionSet.selections.map(m => m.alias.value)).toContain('permission_encoded_Y2FuV3JpdGU');
    });

    it('should throw an error if a variable is missing', () => {
        expect(() => useNodeInfo({path: '/test'}, {getDisplayName: true})).toThrow();
    });

    it('should request site permissions', async () => {
        const setStateMock = jest.fn();
        const useStateMock = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        useNodeInfo({path: '/test', language: 'en'}, {getSitePermissions: ['canRead', 'canWrite']});

        await wait();

        expect(getQuery).toHaveBeenCalled();
        const {mock} = getQuery;
        const result = mock.results[mock.results.length - 1];
        const variables = result.value.generatedVariables;
        result.value.query.definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(result.value.query.definitions.map(d => d.name.value)).toContain('SiteNodePermission_permission_encoded_Y2FuUmVhZA');
        expect(result.value.query.definitions.find(d => d.name.value === 'SiteNodePermission_permission_encoded_Y2FuUmVhZA').selectionSet.selections[0].name.value).toBe('site');
        expect(result.value.query.definitions.find(d => d.name.value === 'SiteNodePermission_permission_encoded_Y2FuUmVhZA').selectionSet.selections[0].selectionSet.selections[1].alias.value).toBe('permission_encoded_Y2FuUmVhZA');
        expect(result.value.query.definitions.find(d => d.name.value === 'SiteNodePermission_permission_encoded_Y2FuV3JpdGU').selectionSet.selections[0].name.value).toBe('site');
        expect(result.value.query.definitions.find(d => d.name.value === 'SiteNodePermission_permission_encoded_Y2FuV3JpdGU').selectionSet.selections[0].selectionSet.selections[1].alias.value).toBe('permission_encoded_Y2FuV3JpdGU');
    });

    it('should request isNodeTypes', async () => {
        const setStateMock = jest.fn();
        const useStateMock = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        useNodeInfo({path: '/test', language: 'en'}, {getIsNodeTypes: ['jnt:typeA', 'jnt:typeB']});

        await wait();

        expect(getQuery).toHaveBeenCalled();
        const {mock} = getQuery;
        const result = mock.results[mock.results.length - 1];
        const variables = result.value.generatedVariables;
        result.value.query.definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(result.value.query.definitions.map(d => d.name.value)).toContain('NodeType_nodeType_encoded_am50OnR5cGVB');
        expect(result.value.query.definitions.find(d => d.name.value === 'NodeType_nodeType_encoded_am50OnR5cGVB').selectionSet.selections.map(m => m.alias.value)).toContain('nodeType_encoded_am50OnR5cGVB');
        expect(result.value.query.definitions.find(d => d.name.value === 'NodeType_nodeType_encoded_am50OnR5cGVC').selectionSet.selections.map(m => m.alias.value)).toContain('nodeType_encoded_am50OnR5cGVC');
    });

    it('should request properties', async () => {
        const setStateMock = jest.fn();
        const useStateMock = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        useNodeInfo({path: '/test', language: 'en'}, {getProperties: ['propA', 'propB']});

        await wait();

        expect(getQuery).toHaveBeenCalled();
        const {mock} = getQuery;
        const result = mock.results[mock.results.length - 1];
        const variables = result.value.generatedVariables;
        result.value.query.definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(result.value.query.definitions.map(d => d.name.value)).toContain('NodeProperties');
        expect(result.value.query.definitions.find(d => d.name.value === 'NodeProperties').selectionSet.selections.map(m => m.name.value)).toContain('properties');
    });

    it('should request all data', async () => {
        const setStateMock = jest.fn();
        const useStateMock = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
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

        await wait();

        expect(getQuery).toHaveBeenCalled();
        const {mock} = getQuery;
        const result = mock.results[mock.results.length - 1];
        const variables = result.value.generatedVariables;
        result.value.query.definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));
    });

    it('should trigger a graphql request with path', async () => {
        const setStateMock = jest.fn();
        const useStateMock = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        useNodeInfo({path: '/test', language: 'en'});

        await wait();

        expect(setStateMock.mock.calls[0][0].node).toBeDefined();
        expect(setStateMock.mock.calls[0][0].variables).toBeDefined();
        expect(setStateMock.mock.calls[0][0].variables.path).toBe('/test');
    });

    it('should trigger a graphql request with multiple paths', async () => {
        const setStateMock = jest.fn();
        const useStateMock = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        const paths = ['/test', '/test2'];
        useNodeInfo({paths, language: 'en'});

        await wait();

        expect(setStateMock.mock.calls[0][0].node).toBeDefined();
        expect(setStateMock.mock.calls[0][0].variables).toBeDefined();
        expect(setStateMock.mock.calls[0][0].variables.paths).toBe(paths);
    });
});
