import {useContentPreview} from './index.js';

jest.mock('react-apollo', () => ({
    useQuery: jest.fn(() => ({
        data: {},
        loading: false,
        error: null
    }))
}));

import {useQuery} from 'react-apollo';

describe('useContentPreview', () => {
    let args;
    beforeEach(() => {
        args = {
            path: 'site/digitall',
            workspace: 'home',
            language: 'fr',
            templateType: 'player',
            view: 'partial',
            contextConfiguration: 'cc',
            requestAttributes: 'attrs'
        };
    });

    it('should trigger a graphql request', () => {
        useContentPreview(args);
        expect(useQuery).toHaveBeenCalled();
    });

    it('should return empty object when return empty data', () => {
        expect(useContentPreview(args).data).toEqual({});
    });
});
