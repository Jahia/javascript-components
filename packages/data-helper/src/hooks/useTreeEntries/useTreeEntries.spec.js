import {useTreeEntries} from './index.js';
import {useQuery} from 'react-apollo';
import {print} from 'graphql/language/printer';

jest.mock('react-apollo', () => ({
    useQuery: jest.fn(() => ({
        data: {},
        loading: false,
        error: null
    }))
}));

jest.mock('react', () => ({
    useRef: v => ({
        current: v
    })
}));

describe('useTreeEntries', () => {
    it('should trigger a graphql request', () => {
        useTreeEntries({
            rootPaths: ['/test'],
            openPaths: [],
            selectedPaths: ['/test'],
            openableTypes: ['content'],
            selectableTypes: ['content'],
            queryVariables: {lang: 'en'},
            hideRoot: true
        });
        expect(useQuery).toHaveBeenCalled();

        const {mock} = useQuery;
        const call = mock.calls[mock.calls.length - 1];
        const gql = print(call[0]);

        expect(gql).toContain('PickerQuery');
    });

    it('should return undefined object when variables are empty', () => {
        expect(useTreeEntries({}).data).toEqual(undefined);
    });
});
