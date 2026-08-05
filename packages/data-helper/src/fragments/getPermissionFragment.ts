import {graphql} from '../gql';
import {encodeName} from './encodeName';
import {Fragment} from './PredefinedFragments';

const fragments:{[key:string]: Fragment} = {};

export const getPermissionFragment = (name: string) => {
    const encodedName = getEncodedPermissionName(name);
    if (!fragments[encodedName]) {
        fragments[encodedName] = {
            applyFor: 'node',
            variables: {
                [encodedName]: 'String!'
            },
            gql: graphql(`fragment NodePermission_${encodedName} on JCRNode {
                ${encodedName}:hasPermission(permissionName: $${encodedName})
            }`)
        };
    }

    return {
        fragment: fragments[encodedName],
        variables: {
            [encodedName]: name
        }
    };
};

export const getSitePermissionFragment = (name: string) => {
    const encodedName = getEncodedPermissionName(name);
    if (!fragments['site_' + encodedName]) {
        fragments['site_' + encodedName] = {
            applyFor: 'node',
            variables: {
                [encodedName]: 'String!'
            },
            gql: graphql(`fragment SiteNodePermission_${encodedName} on JCRNode {
                site {
                    ...NodeCacheRequiredFields
                    ${encodedName}:hasPermission(permissionName: $${encodedName})
                }
            }`)
        };
    }

    return {
        fragment: fragments['site_' + encodedName],
        variables: {
            [encodedName]: name
        }
    };
};

export const getEncodedPermissionName = (name: string) => 'permission_' + encodeName(name);
