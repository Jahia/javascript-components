import {useQuery} from 'react-apollo';
import {SITE_INFO_QUERY} from './useSiteInfo.gql-queries';

const adaptSiteInfo = data => {
    if (data && (data.jcr || data.wsDefault)) {
        const res = data.jcr ? data.jcr.result : data.wsDefault.result;
        if (res) {
            return {...res.site};
        }
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
