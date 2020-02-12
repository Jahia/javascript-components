import gql from 'graphql-tag';

export const PredefinedFragments = {
    id: {
        applyFor: 'relayNode',
        gql: gql`fragment NodeId on Node {
            id
        }`
    },
    displayName: {
        variables: {
            lang: 'String!'
        },
        applyFor: 'node',
        gql: gql`fragment NodeDisplayName on JCRNode {
            displayName(language:$lang)
        }`
    },
    allProperties: {
        variables: {
            lang: 'String!'
        },
        applyFor: 'node',
        gql: gql`fragment NodeAllProperties on JCRNode {
            properties(language:$lang) {
                name,
                value
            }
        }`
    },
    siteHomePage: {
        applyFor: 'node',
        gql: gql`fragment NodeSiteHomePage on JCRNode {
            children(typesFilter:{types:["jnt:page"]}, propertiesFilter:{filters:[{property:"j:isHomePage", value:"true" }]}) {
                nodes {
                    path
                }
            }
        }`
    },
    nodeCacheRequiredFields: {
        applyFor: 'node',
        gql: gql`fragment NodeCacheRequiredFields on JCRNode {
            uuid
            workspace
            path

        }`
    },
    nodeTypeDisplayName: {
        variables: {
            lang: 'String!'
        },
        applyFor: 'nodeType',
        gql: gql`fragment NodeTypeDisplayName on JCRNodeType {
            displayName(language:$lang)
        }`
    },
    nodeTypeSubTypes: {
        variables: {
            lang: 'String!'
        },
        applyFor: 'nodeType',
        gql: gql`fragment NodeTypeSubTypes on JCRNodeType {
            subtypes {
                nodes {
                    name
                    displayName(language:$lang)
                    abstract
                    mixin
                }
            }
        }`
    },
    jcrQueryCacheRequiredFields: {
        applyFor: 'jcrquery',
        gql: gql`fragment QueryCacheRequiredFields on JCRQuery {
            workspace
        }`
    }
};
