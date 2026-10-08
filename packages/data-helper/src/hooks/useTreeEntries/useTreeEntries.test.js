import {useTreeEntries} from './useTreeEntries';
import {useQuery} from '@apollo/client';
import {print} from 'graphql/language/printer';

jest.mock('@apollo/client', () => ({
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

    it('should read the tree in the language of the query variables', () => {
        useTreeEntries({
            rootPaths: ['/test'],
            openPaths: [],
            queryVariables: {language: 'fr'}
        });

        const {mock} = useQuery;
        const call = mock.calls[mock.calls.length - 1];
        expect(call[1].variables.validInLanguage).toEqual('fr');
    });

    it('should keep the entries it received when the server refused a connection', () => {
        const node = (name, children) => ({name, uuid: name, path: `/test/${name}`, openable: true, selectable: true, children});
        useQuery.mockReturnValueOnce({
            data: {
                jcr: {
                    rootNodes: [node('root', {pageInfo: {nodesCount: 2}})],
                    openNodes: [
                        {uuid: 'root', path: '/test/root', children: {nodes: [node('a', null), node('b', {pageInfo: {nodesCount: 0}})]}},
                        {uuid: 'a', path: '/test/root/a', children: null}
                    ]
                }
            }
        });

        const {treeEntries} = useTreeEntries({
            rootPaths: ['/test/root'],
            openPaths: ['/test/root', '/test/root/a'],
            selectedPaths: []
        });

        expect(treeEntries.map(entry => [entry.name, entry.hasChildren])).toEqual([
            ['root', true],
            ['a', false],
            ['b', false]
        ]);
    });
});
