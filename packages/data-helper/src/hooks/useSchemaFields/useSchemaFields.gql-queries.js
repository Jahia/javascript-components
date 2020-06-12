import gql from 'graphql-tag';

export const SCHEMA_FIELDS_QUERY = gql`query schemaFields {
    __schema {
        types {
            name
            fields {
                name
                args {
                    name
                }
                type {
                    name
                }
            }
        }
    }
}`;
