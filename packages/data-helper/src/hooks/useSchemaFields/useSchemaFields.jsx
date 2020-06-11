import {useQuery} from 'react-apollo';
import {SCHEMA_FIELDS_QUERY} from './useSchemaFields.gql-queries';

export const useSchemaFields = () => {
    const {data} = useQuery(SCHEMA_FIELDS_QUERY);
    return data && data.__schema.types.filter(type => type.fields !== null);
};
