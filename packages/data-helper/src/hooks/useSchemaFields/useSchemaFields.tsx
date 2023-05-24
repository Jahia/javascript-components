import {useQuery} from '@apollo/client';
import {SCHEMA_FIELDS_QUERY} from './useSchemaFields.gql-queries';

export const useSchemaFields = (variables: {[key:string]: any}) => useQuery(SCHEMA_FIELDS_QUERY, {variables});
