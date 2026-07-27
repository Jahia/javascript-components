import {graphql} from '../gql';

export const PickerItemsFragment = {
    mixinTypes: {
        applyFor: 'node',
        gql: graphql(`fragment MixinTypes on JCRNode {
            mixinTypes {
                name
            }
        }`)
    },
    isPublished: {
        applyFor: 'node',
        variables: {
            language: 'String!'
        },
        gql: graphql(`fragment PublicationStatus on JCRNode {
            publicationStatus: aggregatedPublicationInfo(language: $language) {
                publicationStatus
            }
        }`)
    },
    primaryNodeType: {
        applyFor: 'node',
        gql: graphql(`fragment PrimaryNodeTypeName on JCRNode {
            primaryNodeType {
                name
            }
        }`)
    }
};
