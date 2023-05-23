import gql from 'graphql-tag';
import {
    aggregatedPublicationInfoWithExistInLive,
    aggregatedPublicationInfo,
    childNodeTypes,
    contentRestrictions,
    displayableNode,
    displayName,
    getProperties,
    installedModules,
    lockInfo,
    mimeTypes,
    nodeCacheRequiredFields,
    operationSupport,
    parentNode,
    primaryNodeType,
    replaceFragmentsInDocument,
    siteLanguages,
    subNodesCount
} from '../../fragments';
import {getPermissionFragment, getSitePermissionFragment} from '../../fragments/getPermissionFragment';
import {getNodeTypeFragment} from '../../fragments/getIsNodeTypeFragment';
import {DocumentNode} from 'graphql';

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
                        }
                    }
                }
                ${nodeCacheRequiredFields.gql}
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
                        }
                    }
                }
                ${nodeCacheRequiredFields.gql}
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
                        }
                    }
                }
                ${nodeCacheRequiredFields.gql}
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
                    }
                }
            }
            ${nodeCacheRequiredFields.gql}
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
    getChildNodeTypes: boolean,
    getContributeTypesRestrictions: boolean,
    getSubNodesCount: {
        types?: string[]
    },
    getMimeType: boolean,
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
    'getChildNodeTypes',
    'getContributeTypesRestrictions',
    'getSubNodesCount',
    'getMimeType'
];

export const getQuery = (variables: {[key:string]: any}, schemaResult: any, options: NodeInfoOptions = {}) => {
    const fragments = [];

    const {baseQuery, generatedVariables, skip} = getBaseQueryAndVariables(variables);

    if (!skip) {
        if (options.getDisplayName) {
            fragments.push(displayName);
            if (!variables.language) {
                throw Error('language is required');
            }

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
            const supportsExistsInLive = schemaResult && schemaResult.__type && schemaResult.__type.fields && schemaResult.__type.fields.find((field: any) => field.name === 'existsInLive') !== undefined;
            if (supportsExistsInLive) {
                fragments.push(aggregatedPublicationInfoWithExistInLive);
            } else {
                fragments.push(aggregatedPublicationInfo);
            }

            if (!variables.language) {
                throw Error('language is required');
            }

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

            if (!variables.language) {
                throw Error('language is required');
            }

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

        if (options.getChildNodeTypes) {
            fragments.push(childNodeTypes);
        }

        if (options.getContributeTypesRestrictions) {
            fragments.push(contentRestrictions);
        }

        if (options.getSubNodesCount) {
            fragments.push(subNodesCount);
            generatedVariables.subNodesCountTypes = options.getSubNodesCount.types ? options.getSubNodesCount.types : ['nt:base'];
        }

        if (options.getMimeType) {
            fragments.push(mimeTypes);
        }
    }

    return {
        query: replaceFragmentsInDocument(baseQuery, fragments),
        generatedVariables,
        skip
    };
};
