import {useNodeChecks} from './index.js';
import {useQuery} from 'react-apollo';

jest.mock('react-apollo', () => {
    return {
        useQuery: jest.fn(() => ({
            data: {
                jcr: {
                    nodeByPath: {
                    }
                }
            },
            loading: false,
            error: null
        }))
    };
});

jest.mock('react', () => ({
    useRef: v => ({
        current: v
    })
}));

describe('useNodeChecks', () => {
    it('should request permissions', () => {
        useNodeChecks({path: '/test', language: 'en'}, {requiredPermission: ['canRead', 'canWrite']});

        expect(useQuery).toHaveBeenCalled();

        const mock = useQuery.mock;
        const call = mock.calls[mock.calls.length - 1];

        const variables = call[1].variables;
        call[0].definitions[0].variableDefinitions.map(v => v.variable.name.value).forEach(v => expect(Object.keys(variables)).toContain(v));

        expect(call[0].definitions.map(d => d.name.value)).toContain('NodeInfoNodePermission');
        expect(call[0].definitions.find(d => d.name.value === 'NodeInfoNodePermission').selectionSet.selections.map(m => m.alias.value)).toContain('canRead');
        expect(call[0].definitions.find(d => d.name.value === 'NodeInfoNodePermission').selectionSet.selections.map(m => m.alias.value)).toContain('canWrite');
    });
});
