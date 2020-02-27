// TODO BACKLOG-12393 - refactor Legacy Picker into hook without lodash
import {usePicker} from './index.js';

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

describe('usePicker', () => {
    it.skip('should trigger a graphql request', () => {
        usePicker({});
        expect(useQuery).toHaveBeenCalled();
    });

    it.skip('should return empty object when return emtpy data', () => {
        expect(usePicker({}).data).toEqual({});
    });
});
