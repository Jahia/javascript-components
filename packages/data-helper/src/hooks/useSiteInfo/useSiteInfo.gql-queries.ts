import {graphql} from '../../gql';
import {nodeCacheRequiredFields} from '../../fragments/PredefinedFragments';

export const SITE_INFO_QUERY = graphql(`
    query siteInfo($path: String!, $displayLanguage:String!, $uiLanguage:String, $skipUILanguage:Boolean!) {
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
            localizedDisplayName: displayName(language: $displayLanguage)
            uiLanguageDisplayName: displayName(language: $uiLanguage) @skip(if: $skipUILanguage)
            language
            activeInEdit
        }
    }
`, [nodeCacheRequiredFields.gql]);
