import gql from 'graphql-tag';
import {nodeCacheRequiredFields} from '../../fragments/PredefinedFragments';

export const TREE_QUERY = gql`
    query PickerQuery($rootPaths:[String!]!, $selectable:[String]!, $openable:[String]!, $openPaths:[String!]!, $types:[String]!, $recursionTypesFilter: InputNodeTypesInput, $sortBy: InputFieldSorterInput, $fieldGrouping: InputFieldGroupingInput) {
        jcr {
            rootNodes:nodesByPath(paths: $rootPaths) {
                name
                children: descendants(typesFilter:{types: $types}, recursionTypesFilter: $recursionTypesFilter, limit:1) {
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
                children:descendants(typesFilter:{types: $types}, recursionTypesFilter: $recursionTypesFilter, fieldSorter: $sortBy, fieldGrouping: $fieldGrouping) {
                    nodes {
                        name
                        children: descendants(typesFilter:{types: $types}, recursionTypesFilter: $recursionTypesFilter, limit:1) {
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
