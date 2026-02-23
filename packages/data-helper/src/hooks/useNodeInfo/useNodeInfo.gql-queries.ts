import gql from 'graphql-tag';
import {
    aggregatedPublicationInfo,
    canLockUnlock,
    childNodeTypes,
    contentRestrictions,
    displayableNode,
    displayName,
    Fragment,
    getProperties,
    installedModules, isExternal,
    lockInfo,
    mimeTypes,
    nodeCacheRequiredFields,
    operationSupport,
    parentNode,
    primaryNodeType,
    replaceFragmentsInDocument,
    siteLanguages
} from '~/fragments';
import {getPermissionFragment, getSitePermissionFragment} from '~/fragments/getPermissionFragment';
import {getNodeTypeFragment} from '~/fragments/getIsNodeTypeFragment';
import {DocumentNode} from 'graphql';
import {getSubNodesCountFragment} from '~/fragments/getSubNodesCountFragment';

const getBaseQueryAndVariables = (variables: {[key:string]: any}): {
    baseQuery: DocumentNode,
    generatedVariables:{[key:string]: unknown},
    skip: boolean
} => {
    if (variables.paths) {
        return {
            baseQuery: gql`
                query NodesByPathInfoQuery($paths:[String!]!) {
                    jcr {
                        nodesByPath(paths:$paths) {
                            name
                            ...node
                            ...NodeCacheRequiredFields
                            ...External
                        }
                    }
                }
                ${nodeCacheRequiredFields.gql}
                ${isExternal.gql}
            `,
            generatedVariables: {
                paths: variables.paths
            },
            skip: false
        };
    }

    if (variables.uuid && variables.uuid.length > 0) {
        return {
            baseQuery: gql`
                query NodeByUuidInfoQuery($uuid:String!) {
                    jcr {
                        nodeById(uuid:$uuid) {
                            name
                            ...node
                            ...NodeCacheRequiredFields
                            ...External
                        }
                    }
                }
                ${nodeCacheRequiredFields.gql}
                ${isExternal.gql}
            `,
            generatedVariables: {
                uuid: variables.uuid
            },
            skip: false
        };
    }

    if (variables.uuids) {
        return {
            baseQuery: gql`
                query NodesByUuidInfoQuery($uuids:[String!]!) {
                    jcr {
                        nodesById(uuids:$uuids) {
                            name
                            ...node
                            ...NodeCacheRequiredFields
                            ...External
                        }
                    }
                }
                ${nodeCacheRequiredFields.gql}
                ${isExternal.gql}
            `,
            generatedVariables: {
                uuids: variables.uuids
            },
            skip: false
        };
    }

    return {
        baseQuery: gql`
            query NodeByPathInfoQuery($path:String!) {
                jcr {
                    nodeByPath(path:$path) {
                        name
                        ...node
                        ...NodeCacheRequiredFields
                        ...External
                    }
                }
            }
            ${nodeCacheRequiredFields.gql}
            ${isExternal.gql}
        `,
        generatedVariables: {
            path: variables.path
        },
        skip: !variables.path || variables.path.length === 0
    };
};

export type NodeInfoOptions = Partial<{
    getDisplayName: boolean,
    getPrimaryNodeType: boolean,
    getParent: boolean,
    getAggregatedPublicationInfo: {
        subNodes: boolean, reference: boolean
    },
    getOperationSupport: boolean,
    getPermissions: string[],
    getSitePermissions: string[],
    getIsNodeTypes: string[],
    getProperties: string[],
    getSiteInstalledModules: boolean,
    getSiteLanguages: boolean,
    getDisplayableNodePath: boolean,
    getLockInfo: boolean,
    getCanLockUnlock: boolean,
    getChildNodeTypes: boolean,
    getContributeTypesRestrictions: boolean,
    getSubNodesCount: string[],
    getMimeType: boolean,
    applyFragment: Fragment,
    skip: boolean
}>;

export const validOptions = [
    'getDisplayName',
    'getPrimaryNodeType',
    'getParent',
    'getAggregatedPublicationInfo',
    'getOperationSupport',
    'getPermissions',
    'getSitePermissions',
    'getIsNodeTypes',
    'getProperties',
    'getSiteInstalledModules',
    'getSiteLanguages',
    'getDisplayableNodePath',
    'getLockInfo',
    'getCanLockUnlock',
    'getChildNodeTypes',
    'getContributeTypesRestrictions',
    'getSubNodesCount',
    'getMimeType',
    'applyFragment',
    'skip'
];

export const validateQuery = (variables: {[key:string]: any}, options: NodeInfoOptions = {}) => {
    const requiresLanguage = ['getDisplayName', 'getAggregatedPublicationInfo', 'getProperties'] as const;
    const missingLanguageOptions = requiresLanguage
        .filter(attr => Boolean(options[attr as keyof NodeInfoOptions]));
    if (missingLanguageOptions.length > 0 && !variables.language) {
        const msg = `language is required for useNodeInfo options ${missingLanguageOptions.join(',')}`;
        throw new Error(msg);
    }
};

export const getQuery = (variables: {[key:string]: any}, options: NodeInfoOptions = {}) => {
    const fragments = [];

    const {baseQuery, generatedVariables, skip} = getBaseQueryAndVariables(variables);

    if (!skip) {
        validateQuery(variables, options);
        if (options.getDisplayName) {
            fragments.push(displayName);

            generatedVariables.language = variables.language;
        }

        if (options.getPrimaryNodeType) {
            fragments.push(primaryNodeType);
            if (variables.displayLanguage) {
                generatedVariables.displayLanguageSet = true;
                generatedVariables.displayLanguage = variables.displayLanguage;
            } else {
                generatedVariables.displayLanguageSet = false;
                generatedVariables.displayLanguage = '';
            }
        }

        if (options.getParent) {
            fragments.push(parentNode);
        }

        if (options.getAggregatedPublicationInfo) {
            fragments.push(aggregatedPublicationInfo);

            generatedVariables.language = variables.language;
            generatedVariables.aggregatedPublicationInfoSubNodes = Boolean(options.getAggregatedPublicationInfo.subNodes);
            generatedVariables.aggregatedPublicationInfoIncludeReference = Boolean(options.getAggregatedPublicationInfo.reference);
        }

        if (options.getOperationSupport) {
            fragments.push(operationSupport);
        }

        if (options.getPermissions) {
            options.getPermissions.forEach(name => {
                const {fragment, variables: fragmentVariables} = getPermissionFragment(name);
                fragments.push(fragment);
                Object.assign(generatedVariables, fragmentVariables);
            });
        }

        if (options.getSitePermissions) {
            options.getSitePermissions.forEach(name => {
                const {fragment, variables: fragmentVariables} = getSitePermissionFragment(name);
                fragments.push(fragment);
                Object.assign(generatedVariables, fragmentVariables);
            });
        }

        if (options.getIsNodeTypes) {
            options.getIsNodeTypes.forEach(name => {
                const {fragment, variables: fragmentVariables} = getNodeTypeFragment(name);
                fragments.push(fragment);
                Object.assign(generatedVariables, fragmentVariables);
            });
        }

        if (options.getProperties) {
            fragments.push(getProperties);
            generatedVariables.getPropertiesNames = options.getProperties;

            generatedVariables.language = variables.language;
        }

        if (options.getSiteInstalledModules) {
            fragments.push(installedModules);
        }

        if (options.getSiteLanguages) {
            fragments.push(siteLanguages);
        }

        if (options.getDisplayableNodePath) {
            fragments.push(displayableNode);
        }

        if (options.getLockInfo) {
            fragments.push(lockInfo);
        }

        if (options.getCanLockUnlock) {
            fragments.push(canLockUnlock);
        }

        if (options.getChildNodeTypes) {
            fragments.push(childNodeTypes);
        }

        if (options.getContributeTypesRestrictions) {
            fragments.push(contentRestrictions);
        }

        if (options.getSubNodesCount) {
            options.getSubNodesCount.forEach(name => {
                const {fragment, variables: fragmentVariables} = getSubNodesCountFragment(name);
                fragments.push(fragment);
                Object.assign(generatedVariables, fragmentVariables);
            });
        }

        if (options.getMimeType) {
            fragments.push(mimeTypes);
        }

        if (options.applyFragment) {
            fragments.push(options.applyFragment);
        }
    }

    return {
        query: replaceFragmentsInDocument(baseQuery, fragments),
        generatedVariables,
        skip
    };
};
