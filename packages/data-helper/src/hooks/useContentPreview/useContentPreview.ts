import {FetchPolicy, useQuery} from '@apollo/client';
import {VariablesOf} from '../../gql';
import {CONTENT_PREVIEW_QUERY} from './useContentPreview.gql-queries';

type UseContentPreviewType = VariablesOf<typeof CONTENT_PREVIEW_QUERY> & {
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
        workspace: workspace.toUpperCase() as typeof workspace,
        requestAttributes
    };

    return useQuery(CONTENT_PREVIEW_QUERY, {
        variables,
        errorPolicy: 'all',
        fetchPolicy
    });
};
