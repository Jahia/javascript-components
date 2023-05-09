import {useQuery} from 'react-apollo';
import {SCHEMA_FIELDS_QUERY} from './useSchemaFields.gql-queries';

export const useSchemaFields = variables => useQuery(SCHEMA_FIELDS_QUERY, {variables});
