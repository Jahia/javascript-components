import gql from 'graphql-tag';

export const displayName = {
    variables: {
        language: 'String!'
    },
    applyFor: 'node',
    gql: gql`fragment DisplayName on JCRNode {
        displayName(language:$language)
    }`
};

export const primaryNodeType = {
    variables: {
        displayLanguage: 'String!',
        displayLanguageSet: 'Boolean!'
    },
    applyFor: 'node',
    gql: gql`fragment NodeInfoPrimaryNodeType on JCRNode {
        primaryNodeType {
            name
            displayName(language: $displayLanguage) @include(if: $displayLanguageSet)
            icon
        }
    }`
};

export const parentNode = {
    applyFor: 'node',
    gql: gql`fragment ParentNodeInfo on JCRNode {
        parent {
            path
            name
        }
    }`
};

export const aggregatedPublicationInfo = {
    variables: {
        language: 'String!',
        aggregatedPublicationInfoSubNodes: 'Boolean',
        aggregatedPublicationInfoIncludeReference: 'Boolean'
    },
    applyFor: 'node',
    gql: gql`fragment AggregatedPublicationInfo on JCRNode {
        aggregatedPublicationInfo(language: $language, subNodes: $aggregatedPublicationInfoSubNodes, references:$aggregatedPublicationInfoIncludeReference) {
            publicationStatus
        }
    }`
};

export const operationSupport = {
    applyFor: 'node',
    gql: gql`fragment OperationSupport on JCRNode {
        operationsSupport {
            lock
            markForDeletion
            publication
        }
    }`
};

export const allProperties = {
    variables: {
        language: 'String!'
    },
    applyFor: 'node',
    gql: gql`fragment NodeAllProperties on JCRNode {
        properties(language:$language) {
            name
            value
            values
        }
    }`
};

export const getProperties = {
    variables: {
        language: 'String!',
        getPropertiesNames: '[String!]!'
    },
    applyFor: 'node',
    gql: gql`fragment NodeProperties on JCRNode {
        properties(names: $getPropertiesNames, language: $language) {
            name
            value
            values
        }
    }`
};

export const installedModules = {
    applyFor: 'node',
    gql: gql`fragment SiteInstalledModules on JCRNode {
        site {
            installedModulesWithAllDependencies
            ...NodeCacheRequiredFields
        }
    }`
};

export const siteLanguages = {
    applyFor: 'node',
    gql: gql`fragment SiteLanguages on JCRNode {
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
};

export const displayableNode = {
    applyFor: 'node',
    gql: gql`fragment DisplayableNodePath on JCRNode {
        displayableNode {
            path
        }
    }`
};

export const lockInfo = {
    applyFor: 'node',
    gql: gql`fragment LockInfo on JCRNode {
        lockOwner: property(name: "jcr:lockOwner") {
            value
        }
        lockTypes: property(name: "j:lockTypes") {
            values
        }
    }`
};

export const subNodesCount = {
    variables: {
        subNodesCountTypes: '[String!]!'
    },
    applyFor: 'node',
    gql: gql`fragment SubNodesCount on JCRNode {
        subNodes: children(typesFilter: {types: $subNodesCountTypes, multi: ANY}) {
            pageInfo {
                totalCount
            }
        }
    }`
};

export const childNodeTypes = {
    applyFor: 'node',
    gql: gql`fragment AllowedChildNodeType on JCRNode {
        allowedChildNodeTypes(includeSubTypes: false) {
            name
        }
    }`
};

export const contentRestrictions = {
    applyFor: 'node',
    gql: gql`fragment ContentRestriction on JCRNode {
        contributeTypes: property(name: "j:contributeTypes") {
            values
        }
        ancestors(fieldFilter: {filters: {evaluation: NOT_EMPTY, fieldName: "contributeTypes"}}) {
            contributeTypes : property(name: "j:contributeTypes") {
                values
            }
        }
    }`
};

export const siteHomePage = {
    applyFor: 'node',
    gql: gql`fragment NodeSiteHomePage on JCRNode {
        children(typesFilter:{types:["jnt:page"]}, propertiesFilter:{filters:[{property:"j:isHomePage", value:"true" }]}) {
            nodes {
                path
            }
        }
    }`
};

export const nodeCacheRequiredFields = {
    applyFor: 'node',
    gql: gql`fragment NodeCacheRequiredFields on JCRNode {
        uuid
        workspace
        path

    }`
};

export const nodeTypeDisplayName = {
    variables: {
        language: 'String!'
    },
    applyFor: 'nodeType',
    gql: gql`fragment NodeTypeDisplayName on JCRNodeType {
        displayName(language:$language)
    }`
};

export const nodeTypeSubTypes = {
    variables: {
        language: 'String!'
    },
    applyFor: 'nodeType',
    gql: gql`fragment NodeTypeSubTypes on JCRNodeType {
        subTypes {
            nodes {
                name
                displayName(language:$language)
                abstract
                mixin
            }
        }
    }`
};

export const mimeTypes = {
    applyFor: 'node',
    gql: gql`fragment NodeInfoResourceNode on JCRNode {
        resourceChildren: children(names: ["jcr:content"]) {
            nodes {
                mimeType: property(name: "jcr:mimeType") {
                    value
                }
            }
        }
    }`
};

export const PredefinedFragments = {
    displayName,
    primaryNodeType,
    parentNode,
    aggregatedPublicationInfo,
    operationSupport,
    allProperties,
    getProperties,
    installedModules,
    siteLanguages,
    displayableNode,
    lockInfo,
    subNodesCount,
    contentRestrictions,
    siteHomePage,
    nodeCacheRequiredFields,
    nodeTypeDisplayName,
    nodeTypeSubTypes,
    mimeTypes
};
