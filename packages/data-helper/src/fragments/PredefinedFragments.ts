import gql from 'graphql-tag';
import {DocumentNode} from 'graphql';

export type Fragment = {
    variables?: {
        [key: string]: string
    },
    applyFor: string
    gql: DocumentNode
}

export const displayName: Fragment = {
    variables: {
        language: 'String!'
    },
    applyFor: 'node',
    gql: gql`fragment DisplayName on JCRNode {
        displayName(language:$language)
    }`
};

export const primaryNodeType: Fragment = {
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

export const parentNode: Fragment = {
    applyFor: 'node',
    gql: gql`fragment ParentNodeInfo on JCRNode {
        parent {
            path
            name
            ...NodeCacheRequiredFields
        }
    }`
};

export const aggregatedPublicationInfo: Fragment = {
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

export const aggregatedPublicationInfoWithExistInLive: Fragment = {
    variables: {
        language: 'String!',
        aggregatedPublicationInfoSubNodes: 'Boolean',
        aggregatedPublicationInfoIncludeReference: 'Boolean'
    },
    applyFor: 'node',
    gql: gql`fragment AggregatedPublicationInfoWithExistsInLive on JCRNode {
        aggregatedPublicationInfo(language: $language, subNodes: $aggregatedPublicationInfoSubNodes, references:$aggregatedPublicationInfoIncludeReference) {
            publicationStatus
            existsInLive
        }
    }`
};

export const operationSupport: Fragment = {
    applyFor: 'node',
    gql: gql`fragment OperationSupport on JCRNode {
        operationsSupport {
            lock
            markForDeletion
            publication
        }
    }`
};

export const allProperties: Fragment = {
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

export const getProperties: Fragment = {
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

export const installedModules: Fragment = {
    applyFor: 'node',
    gql: gql`fragment SiteInstalledModules on JCRNode {
        site {
            installedModulesWithAllDependencies
            ...NodeCacheRequiredFields
        }
    }`
};

export const siteLanguages: Fragment = {
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

export const displayableNode: Fragment = {
    applyFor: 'node',
    gql: gql`fragment DisplayableNodePath on JCRNode {
        displayableNode {
            path
            ...NodeCacheRequiredFields
        }
    }`
};

export const lockInfo: Fragment = {
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

export const subNodesCount: Fragment = {
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

export const childNodeTypes: Fragment = {
    applyFor: 'node',
    gql: gql`fragment AllowedChildNodeType on JCRNode {
        allowedChildNodeTypes(includeSubTypes: false) {
            name
        }
    }`
};

export const contentRestrictions: Fragment = {
    applyFor: 'node',
    gql: gql`fragment ContentRestriction on JCRNode {
        contributeTypes: property(name: "j:contributeTypes") {
            values
        }
        ancestors(fieldFilter: {filters: {evaluation: NOT_EMPTY, fieldName: "contributeTypes"}}) {
            ...NodeCacheRequiredFields
            contributeTypes : property(name: "j:contributeTypes") {
                values
            }
        }
    }`
};

export const siteHomePage: Fragment = {
    applyFor: 'node',
    gql: gql`fragment NodeSiteHomePage on JCRNode {
        children(typesFilter:{types:["jnt:page"]}, propertiesFilter:{filters:[{property:"j:isHomePage", value:"true" }]}) {
            nodes {
                path
                ...NodeCacheRequiredFields
            }
        }
    }`
};

export const nodeCacheRequiredFields: Fragment = {
    applyFor: 'node',
    gql: gql`fragment NodeCacheRequiredFields on JCRNode {
        uuid
        workspace
        path
    }`
};

export const nodeTypeDisplayName: Fragment = {
    variables: {
        language: 'String!'
    },
    applyFor: 'nodeType',
    gql: gql`fragment NodeTypeDisplayName on JCRNodeType {
        displayName(language:$language)
    }`
};

export const nodeTypeSubTypes: Fragment = {
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

export const mimeTypes: Fragment = {
    applyFor: 'node',
    gql: gql`fragment NodeInfoResourceNode on JCRNode {
        resourceChildren: children(names: ["jcr:content"]) {
            nodes {
                ...NodeCacheRequiredFields
                mimeType: property(name: "jcr:mimeType") {
                    value
                }
            }
        }
    }`
};

export const PredefinedFragments: {[key:string]: Fragment} = {
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
