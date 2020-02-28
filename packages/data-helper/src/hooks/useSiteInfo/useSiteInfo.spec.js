import {useSiteInfo} from './index.js';

jest.mock('react-apollo', () => {
    return {
        useQuery: jest.fn(() => ({
            data: {},
            loading: false,
            error: null
        }))
    };
});

import {useQuery} from 'react-apollo';

describe('useSiteInfo', () => {
    it('should trigger a graphql request', () => {
        useSiteInfo({});
        expect(useQuery).toHaveBeenCalled();
    });

    it('should return empty object when return emtpy data', () => {
        expect(useSiteInfo({}).data).toEqual({});
    });

    it('should adapt siteInfo', () => {
        const data = {
            jcr: {
                result: {
                    site: {
                        serverName: 'localhost',
                        displayName: 'digit-all',
                        languages: [
                            {name: 'art', activeInEdit: true},
                            {name: 'de rue', activeInEdit: false}
                        ]
                    }
                }
            }
        };

        useQuery.mockImplementation(() => ({
            loading: false,
            error: null,
            data
        }));

        expect(useSiteInfo({})).toEqual({
            loading: false,
            error: null,
            data,
            siteInfo: {
                serverName: 'localhost',
                displayName: 'digit-all',
                languages: [{name: 'art', activeInEdit: true}, {name: 'de rue', activeInEdit: false}]
            }
        });
    });
});
