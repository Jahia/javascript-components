import gql from 'graphql-tag';
import {PredefinedFragments} from '../../fragments/PredefinedFragments';

export const SITE_INFO_QUERY = gql`
    query siteInfo($path: String!, $displayLanguage:String!) {
        jcr(workspace: LIVE) {
            result:nodeByPath(path: $path) {
                site {
                    ...SiteInfo
                    ...NodeCacheRequiredFields
                }
                ...NodeCacheRequiredFields
            }
        }
        wsDefault:jcr {
            result:nodeByPath(path: $path) {
                site {
                    ...SiteInfo
                    ...NodeCacheRequiredFields
                }
                ...NodeCacheRequiredFields
            }
        }
    }
    fragment SiteInfo on JCRSite {
        displayName(language: $displayLanguage)
        defaultLanguage
        serverName
        description
        languages {
            displayName
            language
            activeInEdit
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
