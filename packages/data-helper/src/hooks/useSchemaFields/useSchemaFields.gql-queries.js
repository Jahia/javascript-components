import gql from 'graphql-tag';

export const SCHEMA_FIELDS_QUERY = gql`query schemaFields {
    __schema {
        types {
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
