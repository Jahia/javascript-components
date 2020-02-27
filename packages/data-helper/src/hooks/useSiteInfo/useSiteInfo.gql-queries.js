import gql from 'graphql-tag';
import {PredefinedFragments} from '../../fragments/PredefinedFragments';

export const SITE_INFO_QUERY = gql`
    query siteInfo($path: String!, $displayLanguage:String!) {
        jcr(workspace: LIVE) {
            result:nodeByPath(path: $path) {
                site {
                    displayName(language: $displayLanguage)
                    defaultLanguage
                    languages {
                        displayName
                        language
                        activeInEdit
                    }
                    ...NodeCacheRequiredFields
                }
                ...NodeCacheRequiredFields
            }
        }
        wsDefault:jcr {
            result:nodeByPath(path: $path) {
                site {
                    displayName(language: $displayLanguage)
                    defaultLanguage
                    languages {
                        displayName
                        language
                        activeInEdit
                    }
                    ...NodeCacheRequiredFields
                }
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
