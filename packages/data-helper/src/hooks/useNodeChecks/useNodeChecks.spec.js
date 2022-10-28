import {useNodeChecks} from './index.js';
import {useQuery} from 'react-apollo';
import React from 'react';
import {getQuery} from '../useNodeInfo/useNodeInfo.gql-queries';

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
        useApolloClient: jest.fn(() => {
            return {
                query: () => {
                    return {
                        then: inputFcn => {
                            return inputFcn(data);
                        }
                    };
                },
                watchQuery: () => {
                    return {
                        subscribe: inputFcn => {
                            inputFcn(data);
                            return {
                                unsubscribe: () => {}
                            };
                        }
                    };
                }
            };
        })
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
        useMemo: v => v(),
        useState: v => v,
        useEffect: v => v()
    });
});

jest.mock('../useNodeInfo/useNodeInfo.gql-queries', () => {
    const original = jest.requireActual('../useNodeInfo/useNodeInfo.gql-queries');
    return {
        getQuery: jest.fn(original.getQuery),
        validOptions: original.validOptions
    };
});

describe('useNodeChecks', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should request permissions', async () => {
        const setStateMock = jest.fn();
        const useStateMock = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        useNodeChecks({path: '/test', language: 'en'}, {requiredPermission: ['canRead', 'canWrite']});

        await wait();

        expect(getQuery).toHaveBeenCalled();

        const mock = getQuery.mock;
        const result = mock.results[mock.results.length - 1];
        const variables = result.value.generatedVariables;
        result.value.query.definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(result.value.query.definitions.map(d => d.name.value)).toContain('NodePermission_permission_encoded_Y2FuUmVhZA');
        expect(result.value.query.definitions.find(d => d.name.value === 'NodePermission_permission_encoded_Y2FuUmVhZA').selectionSet.selections.map(m => m.alias.value)).toContain('permission_encoded_Y2FuUmVhZA');
        expect(result.value.query.definitions.find(d => d.name.value === 'NodePermission_permission_encoded_Y2FuV3JpdGU').selectionSet.selections.map(m => m.alias.value)).toContain('permission_encoded_Y2FuV3JpdGU');
    });

    it('should request site permissions', async () => {
        const setStateMock = jest.fn();
        const useStateMock = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);
        useNodeChecks({path: '/test', language: 'en'}, {requiredPermission: ['canRead', 'canWrite']});

        await wait();

        expect(getQuery).toHaveBeenCalled();

        const mock = getQuery.mock;
        const result = mock.results[mock.results.length - 1];
        const variables = result.value.generatedVariables;
        result.value.query.definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(result.value.query.definitions.map(d => d.name.value)).toContain('NodePermission_permission_encoded_Y2FuUmVhZA');
        expect(result.value.query.definitions.find(d => d.name.value === 'NodePermission_permission_encoded_Y2FuUmVhZA').selectionSet.selections.map(m => m.alias.value)).toContain('permission_encoded_Y2FuUmVhZA');
        expect(result.value.query.definitions.find(d => d.name.value === 'NodePermission_permission_encoded_Y2FuV3JpdGU').selectionSet.selections.map(m => m.alias.value)).toContain('permission_encoded_Y2FuV3JpdGU');
    });
});
