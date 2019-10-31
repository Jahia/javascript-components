import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';
import PropTypes from 'prop-types';

class SiteInfo extends React.Component {
    constructor(props) {
        super(props);

        this.query = gql`
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
    }

    render() {
        const {siteKey, displayLanguage} = this.props;

        const variables = {
            path: '/sites/' + siteKey,
            displayLanguage: displayLanguage
        };

        return (
            <Query query={this.query} variables={variables}>
                {({error, loading, data}) => {
                    let renderProp = this.props.children;

                    if (error || loading) {
                        return renderProp({siteInfo: {}, error, loading});
                    }

                        let siteInfo = SiteInfo.parseSiteInfo(data);
                        return renderProp({siteInfo: siteInfo, error, loading});
                }}
            </Query>
        );
    }

    static parseSiteInfo(data) {
        let parsedSiteLanguages = [];
        let siteDisplayableName = null;
        if (data && (data.jcr || data.wsDefault)) {
            let siteData = data.jcr ? data.jcr.result.site : data.wsDefault.result.site;
            siteDisplayableName = siteData.displayName;
            let siteLanguages = siteData.languages;
            // eslint-disable-next-line no-unused-vars
            for (let i in siteLanguages) {
                if (siteLanguages[i].activeInEdit) {
                    parsedSiteLanguages.push(siteLanguages[i]);
                }
            }
        }

        return {
            displayName: siteDisplayableName,
            languages: parsedSiteLanguages
        };
    }
}

SiteInfo.defaultProps = {
    siteKey: '',
    displayLanguage: '',
    children: null
};

SiteInfo.propTypes = {

    /**
     * The site key to get the info from it
     */
    siteKey: PropTypes.string,

    /**
     * The display language for i18n names, titles, labels
     */
    displayLanguage: PropTypes.string,

    children: PropTypes.func
};

export {SiteInfo};
