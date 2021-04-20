import gql from 'graphql-tag';
import {encodeName} from './encodeName';

const fragments = {};

export const getPermissionFragment = name => {
    const encodedName = getEncodedPermissionName(name);
    if (!fragments[encodedName]) {
        const fragment = {
            applyFor: 'node',
            variables: {
                [encodedName]: 'String!'
            },
            gql: gql`fragment NodePermission_${encodedName} on JCRNode {
                ${encodedName}:hasPermission(permissionName: $${encodedName})
            }`
        };

        fragments[encodedName] = fragment;
    }

    return {
        fragment: fragments[encodedName],
        variables: {
            [encodedName]: name
        }
    };
};

export const getSitePermissionFragment = name => {
    const encodedName = getEncodedPermissionName(name);
    if (!fragments['site_' + encodedName]) {
        const fragment = {
            applyFor: 'node',
            variables: {
                [encodedName]: 'String!'
            },
            gql: gql`fragment SiteNodePermission_${encodedName} on JCRNode {
                site {
                    ${encodedName}:hasPermission(permissionName: $${encodedName})
                }
            }`
        };

        fragments['site_' + encodedName] = fragment;
    }

    return {
        fragment: fragments['site_' + encodedName],
        variables: {
            [encodedName]: name
        }
    };
};

export const getEncodedPermissionName = name => 'permission_' + encodeName(name);
