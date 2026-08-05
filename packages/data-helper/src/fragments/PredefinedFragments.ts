import {TadaDocumentNode} from 'gql.tada';
import {graphql} from '../gql';

export type Fragment = {
    variables?: {
        [key: string]: string
    },
    applyFor: string
    gql: TadaDocumentNode<unknown, unknown, unknown>
}

export const displayName = {
    variables: {
        language: 'String!'
    },
    applyFor: 'node',
    gql: graphql(`fragment DisplayName on JCRNode {
        displayName(language:$language)
    }`)
} satisfies Fragment;

export const primaryNodeType = {
    variables: {
        displayLanguage: 'String!',
        displayLanguageSet: 'Boolean!'
    },
    applyFor: 'node',
    gql: graphql(`fragment NodeInfoPrimaryNodeType on JCRNode {
        primaryNodeType {
            name
            displayName(language: $displayLanguage) @include(if: $displayLanguageSet)
            icon
        }
    }`)
} satisfies Fragment;

export const nodeCacheRequiredFields = {
    applyFor: 'node',
    gql: graphql(`fragment NodeCacheRequiredFields on JCRNode {
        uuid
        workspace
        path
    }`)
} satisfies Fragment;

export const parentNode = {
    applyFor: 'node',
    gql: graphql(`fragment ParentNodeInfo on JCRNode {
        parent {
            path
            name
            ...NodeCacheRequiredFields
        }
    }`, [nodeCacheRequiredFields.gql])
} satisfies Fragment;

export const aggregatedPublicationInfo = {
    variables: {
        language: 'String!',
        aggregatedPublicationInfoSubNodes: 'Boolean',
        aggregatedPublicationInfoIncludeReference: 'Boolean'
    },
    applyFor: 'node',
    gql: graphql(`fragment AggregatedPublicationInfo on JCRNode {
        aggregatedPublicationInfo(language: $language, subNodes: $aggregatedPublicationInfoSubNodes, references:$aggregatedPublicationInfoIncludeReference) {
            publicationStatus
            existsInLive
        }
    }`)
} satisfies Fragment;

export const operationSupport = {
    applyFor: 'node',
    gql: graphql(`fragment OperationSupport on JCRNode {
        operationsSupport {
            lock
            markForDeletion
            publication
        }
    }`)
} satisfies Fragment;

export const allProperties = {
    variables: {
        language: 'String!'
    },
    applyFor: 'node',
    gql: graphql(`fragment NodeAllProperties on JCRNode {
        properties(language:$language) {
            name
            value
            values
        }
    }`)
} satisfies Fragment;

export const getProperties = {
    variables: {
        language: 'String!',
        getPropertiesNames: '[String!]!'
    },
    applyFor: 'node',
    gql: graphql(`fragment NodeProperties on JCRNode {
        properties(names: $getPropertiesNames, language: $language) {
            name
            value
            values
        }
    }`)
} satisfies Fragment;

export const installedModules = {
    applyFor: 'node',
    gql: graphql(`fragment SiteInstalledModules on JCRNode {
        site {
            installedModulesWithAllDependencies
            ...NodeCacheRequiredFields
        }
    }`, [nodeCacheRequiredFields.gql])
} satisfies Fragment;

export const siteLanguages = {
    applyFor: 'node',
    gql: graphql(`fragment SiteLanguages on JCRNode {
        site {
            defaultLanguage
            ...NodeCacheRequiredFields
            languages {
                displayName
                language
                activeInEdit
            }
        }
    }`, [nodeCacheRequiredFields.gql])
} satisfies Fragment;

export const displayableNode = {
    applyFor: 'node',
    gql: graphql(`fragment DisplayableNodePath on JCRNode {
        displayableNode {
            path
            ...NodeCacheRequiredFields
        }
    }`, [nodeCacheRequiredFields.gql])
} satisfies Fragment;

export const lockInfo = {
    applyFor: 'node',
    gql: graphql(`fragment LockInfo on JCRNode {
        lockOwner: property(name: "jcr:lockOwner") {
            value
        }
        lockTypes: property(name: "j:lockTypes") {
            values
        }
    }`)
} satisfies Fragment;

export const canLockUnlock = {
    applyFor: 'node',
    gql: graphql(`fragment CanLockUnlockInfo on JCRNode {
        lockInfo {
            canLock,
            canUnlock,
        }
    }`)
} satisfies Fragment;

export const subNodesCount = {
    variables: {
        subNodesCountTypes: '[String!]!'
    },
    applyFor: 'node',
    gql: graphql(`fragment SubNodesCount on JCRNode {
        subNodes: children(typesFilter: {types: $subNodesCountTypes, multi: ANY}) {
            pageInfo {
                totalCount
            }
        }
    }`)
} satisfies Fragment;

export const childNodeTypes = {
    applyFor: 'node',
    gql: graphql(`fragment AllowedChildNodeType on JCRNode {
        allowedChildNodeTypes(includeSubTypes: false) {
            name
            displayName(language: $language)
            icon
        }
    }`)
} satisfies Fragment;

export const contentRestrictions = {
    applyFor: 'node',
    gql: graphql(`fragment ContentRestriction on JCRNode {
        contributeTypes: property(name: "j:contributeTypes") {
            values
        }
        ancestors(fieldFilter: {filters: {evaluation: NOT_EMPTY, fieldName: "contributeTypes"}}) {
            ...NodeCacheRequiredFields
            contributeTypes : property(name: "j:contributeTypes") {
                values
            }
        }
    }`, [nodeCacheRequiredFields.gql])
} satisfies Fragment;

export const siteHomePage = {
    applyFor: 'node',
    gql: graphql(`fragment NodeSiteHomePage on JCRNode {
        children(typesFilter:{types:["jnt:page"]}, propertiesFilter:{filters:[{property:"j:isHomePage", value:"true" }]}) {
            nodes {
                path
                ...NodeCacheRequiredFields
            }
        }
    }`, [nodeCacheRequiredFields.gql])
} satisfies Fragment;

export const nodeTypeDisplayName = {
    variables: {
        language: 'String!'
    },
    applyFor: 'nodeType',
    gql: graphql(`fragment NodeTypeDisplayName on JCRNodeType {
        displayName(language:$language)
    }`)
} satisfies Fragment;

export const nodeTypeSubTypes = {
    variables: {
        language: 'String!'
    },
    applyFor: 'nodeType',
    gql: graphql(`fragment NodeTypeSubTypes on JCRNodeType {
        subTypes {
            nodes {
                name
                displayName(language:$language)
                abstract
                mixin
            }
        }
    }`)
} satisfies Fragment;

export const mimeTypes = {
    applyFor: 'node',
    gql: graphql(`fragment NodeInfoResourceNode on JCRNode {
        resourceChildren: children(names: ["jcr:content"]) {
            nodes {
                ...NodeCacheRequiredFields
                mimeType: property(name: "jcr:mimeType") {
                    value
                }
            }
        }
    }`, [nodeCacheRequiredFields.gql])
} satisfies Fragment;

export const isExternal = {
    applyFor: 'node',
    gql: graphql(`fragment External on JCRNode {
        isExternal
    }`)
} satisfies Fragment;

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
    mimeTypes,
    isExternal
} satisfies Record<string, Fragment>;
