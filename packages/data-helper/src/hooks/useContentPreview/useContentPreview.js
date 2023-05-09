import {useQuery} from 'react-apollo';
import {CONTENT_PREVIEW_QUERY} from './useContentPreview.gql-queries';

export const useContentPreview = ({
    path,
    workspace,
    language,
    templateType,
    view,
    contextConfiguration,
    requestAttributes,
    fetchPolicy
}) => {
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
