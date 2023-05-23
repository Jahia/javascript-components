import gql from 'graphql-tag';

export const SCHEMA_FIELDS_QUERY = gql`query schemaFields($type: String!) {
    __type(name: $type) {
        fields {
            name
            args {
                name
                type {
                    name
                }
            }
        }
    }
}`;
