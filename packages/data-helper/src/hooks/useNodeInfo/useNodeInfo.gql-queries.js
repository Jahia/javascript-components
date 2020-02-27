import gql from 'graphql-tag';
import {PredefinedFragments, replaceFragmentsInDocument} from '../../fragments';

const NodeInfoQuery = gql`
    query NodeInfoQuery($path:String!) {
        jcr {
            nodeByPath(path:$path) {
                name
                ...node
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export class NodeInfoQueryHandler {
    constructor(variables, options = {}) {
        this.fragments = [];
        this.variables = {
            path: variables.path
        };

        if (options.getDisplayName) {
            this.fragments.push({
                variables: {
                    language: 'String!'
                },
                applyFor: 'node',
                gql: gql`fragment NodeInfoDisplayName on JCRNode {
                    displayName(language: $language)
                }`
            });
            this.variables.language = variables.language;
        }

        if (options.getPrimaryNodeType) {
            this.fragments.push({
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
            this.variables.displayLanguage = variables.displayLanguage;
        }

        if (options.getParent) {
            this.fragments.push({
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
            this.fragments.push({
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
            this.variables.language = variables.language;
        }

        if (options.getOperationSupport) {
            this.fragments.push({
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
            this.fragments.push({
                variables: permissionNames.map((name, idx) => idx).reduce((acc, idx) => Object.assign(acc, {['permission' + idx]: 'String!'}), {}),
                applyFor: 'node',
                gql: gql`fragment NodeInfoNodePermission on JCRNode {
                    ${permissionNames.map((name, idx) => idx).reduce((acc, idx) => acc + ' ' + permissionNames[idx].replace(':', '_') + ':hasPermission(permissionName: $permission' + idx + ') ', '')}
                }`
            });
            Object.assign(this.variables, permissionNames.map((name, idx) => idx).reduce((acc, idx) => Object.assign(acc, {['permission' + idx]: permissionNames[idx]}), {}));
        }

        if (options.getIsNodeTypes) {
            let nodeTypes = options.getIsNodeTypes;
            this.fragments.push({
                variables: nodeTypes.map((name, idx) => idx).reduce((acc, idx) => Object.assign(acc, {['nodeType' + idx]: 'InputNodeTypesInput!'}), {}),
                applyFor: 'node',
                gql: gql`fragment NodeInfoNodeIsNodeType on JCRNode {
                    ${nodeTypes.map((name, idx) => idx).reduce((acc, idx) => acc + ' ' + nodeTypes[idx].replace(':', '_') + ':isNodeType(type: $nodeType' + idx + ') ', '')}
                }`
            });
            Object.assign(this.variables, nodeTypes.map((name, idx) => idx).reduce((acc, idx) => Object.assign(acc, {['nodeType' + idx]: {types: [nodeTypes[idx]]}}), {}));
        }

        if (options.getProperties) {
            this.fragments.push({
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
            this.variables.getPropertiesNames = options.getProperties;
        }

        if (options.getSiteInstalledModules) {
            this.fragments.push({
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
            this.fragments.push({
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
            this.fragments.push({
                applyFor: 'node',
                gql: gql`fragment NodeInfoDisplayableNodePath on JCRNode {
                    displayableNode {
                        path
                    }
                }`
            });
        }

        if (options.getLockInfo) {
            this.fragments.push({
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
            this.fragments.push({
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
            this.fragments.push({
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
            this.variables.subNodesCountTypes = options.getSubNodesCount.types ? options.getSubNodesCount.types : ['nt:base'];
        }

        if (options.getMimeType) {
            this.fragments.push({
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

        this.query = replaceFragmentsInDocument(NodeInfoQuery, this.fragments);
    }

    getQuery() {
        return this.query;
    }

    getVariables() {
        return this.variables;
    }
}

