import {useQuery} from 'react-apollo';
import {SITE_INFO_QUERY} from './useSiteInfo.gql-queries';

const adaptSiteInfo = data => {
    if (data && (data.jcr || data.wsDefault)) {
        let siteData = data.jcr ? data.jcr.result.site : data.wsDefault.result.site;
        return {...siteData};
    }

    return {
        languages: []
    };
};

export const useSiteInfo = ({siteKey, displayLanguage}) => {
    const variables = {
        path: '/sites/' + siteKey,
        displayLanguage: displayLanguage
    };

    const res = useQuery(SITE_INFO_QUERY, {variables, errorPolicy: 'ignore'});

    return {
        ...res,
        siteInfo: adaptSiteInfo(res.data)
    };
};
