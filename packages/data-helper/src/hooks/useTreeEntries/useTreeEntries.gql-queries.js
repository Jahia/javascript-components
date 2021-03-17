// TODO BACKLOG-12393 - refactor Legacy Picker into hook without lodash
import gql from 'graphql-tag';
import {nodeCacheRequiredFields} from '../../fragments/PredefinedFragments';

export const TREE_QUERY = gql`
    query PickerQuery($rootPaths:[String!]!, $selectable:[String]!, $openable:[String]!, $openPaths:[String!]!, $types:[String]!, $sortBy: InputFieldSorterInput) {
        jcr {
            rootNodes:nodesByPath(paths: $rootPaths) {
                name
                children(typesFilter:{types:$types}, limit:1) {
                    pageInfo {
                        nodesCount
                    }
                }
                selectable : isNodeType(type: {types:$selectable})
                openable : isNodeType(type: {types:$openable})
                ... NodeCacheRequiredFields
                ... node
            },
            openNodes:nodesByPath(paths: $openPaths) {
                ... NodeCacheRequiredFields
                children(typesFilter:{types:$types}, fieldSorter: $sortBy) {
                    nodes {
                        name
                        children(typesFilter:{types:$types}, limit:1) {
                            pageInfo {
                                nodesCount
                            }
                        }
                        selectable : isNodeType(type: {types:$selectable})
                        openable : isNodeType(type: {types:$openable})
                        ... NodeCacheRequiredFields
                        ... node
                    }
                }
            }
        }
    }
${nodeCacheRequiredFields.gql}`;
