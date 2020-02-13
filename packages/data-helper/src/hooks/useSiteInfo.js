import {useQuery} from 'react-apollo';
import {SITE_INFO_QUERY} from './siteInfo.query';

const adaptSiteInfo = data => {
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
};

export const useSiteInfo = ({siteKey, displayLanguage}) => {
    const variables = {
        path: '/sites/' + siteKey,
        displayLanguage: displayLanguage
    };

    const res = useQuery(SITE_INFO_QUERY, {variables});

    return {
        ...res,
        siteInfo: adaptSiteInfo(res.data)
    };
};
