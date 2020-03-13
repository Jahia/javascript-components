import gql from 'graphql-tag';
import {encodeName} from './encodeName';

const fragments = {};

export const getNodeTypeFragment = name => {
    const encodedName = getEncodedNodeTypeName(name);
    if (!fragments[encodedName]) {
        const fragment = {
            applyFor: 'node',
            variables: {
                [encodedName]: 'InputNodeTypesInput!'
            },
            gql: gql`fragment NodeType_${encodedName} on JCRNode {
                ${encodedName}:isNodeType(type: $${encodedName})
            }`
        };

        fragments[encodedName] = fragment;
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

export const getEncodedNodeTypeName = name => 'nodeType_' + encodeName(name);
