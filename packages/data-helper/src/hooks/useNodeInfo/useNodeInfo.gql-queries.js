import gql from 'graphql-tag';
import {
    aggregatedPublicationInfoWithExistInLive,
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
import {getPermissionFragment} from '../../fragments/getPermissionFragment';
import {getNodeTypeFragment} from '../../fragments/getIsNodeTypeFragment';

const getBaseQueryAndVariables = variables => {
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

export const getQuery = (variables, options = {}) => {
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
            if (!variables.displayLanguage) {
                generatedVariables.displayLanguageSet = false;
                generatedVariables.displayLanguage = '';
            } else {
                generatedVariables.displayLanguageSet = true;
                generatedVariables.displayLanguage = variables.displayLanguage;
            }
        }

        if (options.getParent) {
            fragments.push(parentNode);
        }

        if (options.getAggregatedPublicationInfo) {
            fragments.push(aggregatedPublicationInfoWithExistInLive);

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
                const {fragment, variables} = getPermissionFragment(name);
                fragments.push(fragment);
                Object.assign(generatedVariables, variables);
            });
        }

        if (options.getIsNodeTypes) {
            options.getIsNodeTypes.forEach(name => {
                const {fragment, variables} = getNodeTypeFragment(name);
                fragments.push(fragment);
                Object.assign(generatedVariables, variables);
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
