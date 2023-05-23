import {useQuery} from 'react-apollo';
import {CONTENT_PREVIEW_QUERY} from './useContentPreview.gql-queries';
import {FetchPolicy} from '@apollo/client';

type RequestAttribute = {
    name: string, value:string
}

type UseContentPreviewType = {
    path: string,
    workspace: string,
    language: string,
    templateType: string,
    view: string,
    contextConfiguration: string,
    requestAttributes?: RequestAttribute[],
    fetchPolicy?: FetchPolicy
};

export const useContentPreview = ({
    path,
    workspace,
    language,
    templateType,
    view,
    contextConfiguration,
    requestAttributes,
    fetchPolicy
}: UseContentPreviewType) => {
    const variables = {
        path,
        templateType,
        view,
        contextConfiguration,
        language,
        workspace: workspace.toUpperCase(),
        requestAttributes
    };

    return useQuery(CONTENT_PREVIEW_QUERY, {
        variables,
        errorPolicy: 'all',
        fetchPolicy
    });
};
