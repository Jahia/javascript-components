import gql from 'graphql-tag';
import {encodeName} from './encodeName';
import {Fragment} from '~/fragments/PredefinedFragments';

const fragments:{[key:string]: Fragment} = {};

export const getNodeTypeFragment = (name: string) => {
    const encodedName = getEncodedNodeTypeName(name);
    if (!fragments[encodedName]) {
        fragments[encodedName] = {
            applyFor: 'node',
            variables: {
                [encodedName]: 'InputNodeTypesInput!'
            },
            gql: gql`fragment NodeType_${encodedName} on JCRNode {
                ${encodedName}:isNodeType(type: $${encodedName})
            }`
        };
    }

    return {
        fragment: fragments[encodedName],
        variables: {
            [encodedName]: {
                types: name
            }
        }
    };
};

export const getEncodedNodeTypeName = (name:string) => 'nodeType_' + encodeName(name);
