import gql from 'graphql-tag';
import {PredefinedFragments, replaceFragmentsInDocument} from '../../fragments';

const getBaseQueryAndVariables = variables => {
    if (variables.path) {
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
                ${PredefinedFragments.nodeCacheRequiredFields.gql}
            `,
            generatedVariables: {
                path: variables.path
            }
        };
    }

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
                ${PredefinedFragments.nodeCacheRequiredFields.gql}
            `,
            generatedVariables: {
                paths: variables.paths
            }
        };
    }

    if (variables.uuid) {
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
                ${PredefinedFragments.nodeCacheRequiredFields.gql}
            `,
            generatedVariables: {
                uuid: variables.uuid
            }
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
                ${PredefinedFragments.nodeCacheRequiredFields.gql}
            `,
            generatedVariables: {
                uuids: variables.uuids
            }
        };
    }
};

export const getQuery = (variables, options = {}) => {
    const fragments = [];

    const {baseQuery, generatedVariables} = getBaseQueryAndVariables(variables);

    if (!baseQuery) {
        return;
    }

    if (options.getDisplayName) {
        fragments.push({
            variables: {
                language: 'String!'
            },
            applyFor: 'node',
            gql: gql`fragment NodeInfoDisplayName on JCRNode {
                displayName(language: $language)
            }`
        });
        generatedVariables.language = variables.language;
    }

    if (options.getPrimaryNodeType) {
        fragments.push({
            variables: {
                displayLanguage: 'String!'
            },
            applyFor: 'node',
            gql: gql`fragment NodeInfoPrimaryNodeType on JCRNode {
                primaryNodeType {
                    name
                    displayName(language: $displayLanguage)
                    icon
                }
            }`
        });
        generatedVariables.displayLanguage = variables.displayLanguage;
    }

    if (options.getParent) {
        fragments.push({
            applyFor: 'node',
            gql: gql`fragment NodeInfoParentNodeInfo on JCRNode {
                parent {
                    path
                    name
                }
            }`
        });
    }

    if (options.getAggregatedPublicationInfo) {
        fragments.push({
            variables: {
                language: 'String!'
            },
            applyFor: 'node',
            gql: gql`fragment NodeInfoAggregatedPublicationInfo on JCRNode {
                aggregatedPublicationInfo(language: $language) {
                    publicationStatus
                }
            }`
        });
        generatedVariables.language = variables.language;
    }

    if (options.getOperationSupport) {
        fragments.push({
            applyFor: 'node',
            gql: gql`fragment NodeInfoOperationSupport on JCRNode {
                operationsSupport {
                    lock
                    markForDeletion
                    publication
                }
            }`
        });
    }

    if (options.getPermissions) {
        let permissionNames = options.getPermissions;
        fragments.push({
            variables: permissionNames.map((name, idx) => idx).reduce((acc, idx) => Object.assign(acc, {['permission' + idx]: 'String!'}), {}),
            applyFor: 'node',
            gql: gql`fragment NodeInfoNodePermission on JCRNode {
                ${permissionNames.map((name, idx) => idx).reduce((acc, idx) => acc + ' ' + permissionNames[idx].replace(':', '_') + ':hasPermission(permissionName: $permission' + idx + ') ', '')}
            }`
        });
        Object.assign(generatedVariables, permissionNames.map((name, idx) => idx).reduce((acc, idx) => Object.assign(acc, {['permission' + idx]: permissionNames[idx]}), {}));
    }

    if (options.getIsNodeTypes) {
        let nodeTypes = options.getIsNodeTypes;
        fragments.push({
            variables: nodeTypes.map((name, idx) => idx).reduce((acc, idx) => Object.assign(acc, {['nodeType' + idx]: 'InputNodeTypesInput!'}), {}),
            applyFor: 'node',
            gql: gql`fragment NodeInfoNodeIsNodeType on JCRNode {
                ${nodeTypes.map((name, idx) => idx).reduce((acc, idx) => acc + ' ' + nodeTypes[idx].replace(':', '_') + ':isNodeType(type: $nodeType' + idx + ') ', '')}
            }`
        });
        Object.assign(generatedVariables, nodeTypes.map((name, idx) => idx).reduce((acc, idx) => Object.assign(acc, {['nodeType' + idx]: {types: [nodeTypes[idx]]}}), {}));
    }

    if (options.getProperties) {
        fragments.push({
            variables: {
                getPropertiesNames: '[String!]!'
            },
            applyFor: 'node',
            gql: gql`fragment NodeInfoNodeProperties on JCRNode {
                properties(names: $getPropertiesNames, language: $language) {
                    name
                    value
                    values
                }
            }`
        });
        generatedVariables.getPropertiesNames = options.getProperties;
    }

    if (options.getSiteInstalledModules) {
        fragments.push({
            applyFor: 'node',
            gql: gql`fragment NodeInfoSiteInstalledModules on JCRNode {
                site {
                    installedModulesWithAllDependencies
                    ...NodeCacheRequiredFields
                }
            }`
        });
    }

    if (options.getSiteLanguages) {
        fragments.push({
            applyFor: 'node',
            gql: gql`fragment NodeInfoSiteLanguages on JCRNode {
                site {
                    defaultLanguage
                    ...NodeCacheRequiredFields
                    languages {
                        displayName
                        language
                        activeInEdit
                    }
                }
            }`
        });
    }

    if (options.getDisplayableNodePath) {
        fragments.push({
            applyFor: 'node',
            gql: gql`fragment NodeInfoDisplayableNodePath on JCRNode {
                displayableNode {
                    path
                }
            }`
        });
    }

    if (options.getLockInfo) {
        fragments.push({
            applyFor: 'node',
            gql: gql`fragment NodeInfoLockInfo on JCRNode {
                lockOwner: property(name: "jcr:lockOwner") {
                    value
                }
                lockTypes: property(name: "j:lockTypes") {
                    values
                }
            }`
        });
    }

    if (options.getContributeTypesRestrictions) {
        fragments.push({
            applyFor: 'node',
            gql: gql`fragment NodeInfoContentRestriction on JCRNode {
                contributeTypes: property(name: "j:contributeTypes") {
                    values
                }
                ancestors(fieldFilter: {filters: {evaluation: NOT_EMPTY, fieldName: "contributeTypes"}}) {
                    contributeTypes : property(name: "j:contributeTypes", language: $language) {
                        values
                    }
                }
            }`
        });
    }

    if (options.getSubNodesCount) {
        fragments.push({
            variables: {
                subNodesCountTypes: '[String!]!'
            },
            applyFor: 'node',
            gql: gql`fragment NodeInfoSubNodesCount on JCRNode {
                subNodes: children(typesFilter: {types: $subNodesCountTypes, multi: ANY}) {
                    pageInfo {
                        totalCount
                    }
                }
            }`
        });
        generatedVariables.subNodesCountTypes = options.getSubNodesCount.types ? options.getSubNodesCount.types : ['nt:base'];
    }

    if (options.getMimeType) {
        fragments.push({
            applyFor: 'node',
            gql: gql`fragment NodeInfoResourceNode on JCRNode {
                children(typesFilter: {types: ["jnt:resource"]}) {
                    nodes {
                        mimeType: property(name: "jcr:mimeType") {
                            value
                        }
                    }
                }
            }`
        });
    }

    return {
        query: replaceFragmentsInDocument(baseQuery, fragments),
        generatedVariables,
        fragments
    };
};
