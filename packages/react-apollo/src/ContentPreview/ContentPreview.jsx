import React from 'react';
import PropTypes from 'prop-types';
import {Query} from 'react-apollo';
import {lodash as _} from 'lodash';
import {previewQuery} from './ContentPreview.gql-queries';

const ContentPreview = ({path, workspace, language, templateType, view, contextConfiguration, requestAttributes, setRefetch, fetchPolicy, children}) => {
    const queryVariables = {
        path: path,
        templateType: templateType,
        view: view,
        contextConfiguration: contextConfiguration,
        language: language,
        workspace: workspace.toUpperCase(),
        requestAttributes: requestAttributes
    };

    return (
        <Query query={previewQuery}
               errorPolicy="all"
               variables={queryVariables}
               fetchPolicy={fetchPolicy}
        >
            {({loading, data, refetch}) => {
                if (setRefetch) {
                    setRefetch({
                        query: previewQuery,
                        queryParams: queryVariables,
                        refetch: refetch
                    });
                }

                if (!loading) {
                    if (!_.isEmpty(data)) {
                        return (
                            <>
                                {children(data)}
                            </>
                        );
                    }
                }

                return null;
            }}
        </Query>
    );
};

ContentPreview.defaultProps = {
    setRefetch: null,
    fetchPolicy: 'cache-first',
    requestAttributes: null
};

ContentPreview.propTypes = {
    children: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    workspace: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    templateType: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    contextConfiguration: PropTypes.string.isRequired,
    requestAttributes: PropTypes.arrayOf(PropTypes.object),
    setRefetch: PropTypes.func,
    fetchPolicy: PropTypes.string
};

export {ContentPreview};
