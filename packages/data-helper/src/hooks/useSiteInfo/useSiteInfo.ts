import {useQuery} from '@apollo/client';
import {SITE_INFO_QUERY} from './useSiteInfo.gql-queries';
import {ResultOf} from '../../gql';

const adaptSiteInfo = (data: ResultOf<typeof SITE_INFO_QUERY>) => {
    if (data && (data.jcr || data.wsDefault)) {
        const res = data.jcr ? data.jcr.result : data.wsDefault.result;
        if (res) {
            return {...res.site};
        }
    }

    return {
        languages: [] as never[]
    };
};

export const useSiteInfo = ({siteKey, displayLanguage, uiLanguage}: {siteKey: string, displayLanguage: string, uiLanguage: string}) => {
    const variables = {
        path: '/sites/' + siteKey,
        displayLanguage,
        skipUILanguage: true,
        uiLanguage: ''
    };

    if (uiLanguage !== undefined) {
        variables.skipUILanguage = false;
        variables.uiLanguage = uiLanguage;
    }

    const res = useQuery(SITE_INFO_QUERY, {variables, errorPolicy: 'ignore'});

    return {
        ...res,
        siteInfo: adaptSiteInfo(res.data)
    };
};
