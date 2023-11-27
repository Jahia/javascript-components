import gql from 'graphql-tag';
import {encodeName} from './encodeName';
import {Fragment} from '~/fragments/PredefinedFragments';

const fragments:{[key:string]: Fragment} = {};

export const getSubNodesCountFragment = (name: string) => {
    const encodedName = getEncodedSubNodesCountName(name);
    if (!fragments[encodedName]) {
        fragments[encodedName] = {
            applyFor: 'node',
            variables: {
                [encodedName]: '[String!]!'
            },
            gql: gql`fragment SubNodesCount_${encodedName} on JCRNode {
                ${encodedName}: children(typesFilter: {types: $${encodedName}}) {
                    pageInfo {
                        totalCount
                    }
                }
            }`
        };
    }

    return {
        fragment: fragments[encodedName],
        variables: {
            [encodedName]: [name]
        }
    };
};

export const getEncodedSubNodesCountName = (name:string) => 'subNodesCount_' + encodeName(name);
