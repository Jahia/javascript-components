import {graphql} from '../../gql';
import {nodeCacheRequiredFields} from '../../fragments/PredefinedFragments';

export const TREE_QUERY = graphql(`
    query PickerQuery($rootPaths:[String!]!, $selectable:[String]!, $openable:[String]!, $openPaths:[String!]!, $types:[String]!, $recursionTypesFilter: InputNodeTypesInput, $sortBy: InputFieldSorterInput, $fieldGrouping: InputFieldGroupingInput, $validInLanguage: String) {
        jcr {
            rootNodes:nodesByPath(paths: $rootPaths) {
                name
                children: descendants(typesFilter:{types: $types}, recursionTypesFilter: $recursionTypesFilter, validInLanguage: $validInLanguage, limit:1) {
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
                children:descendants(typesFilter:{types: $types}, recursionTypesFilter: $recursionTypesFilter, validInLanguage: $validInLanguage, fieldSorter: $sortBy, fieldGrouping: $fieldGrouping) {
                    nodes {
                        name
                        children: descendants(typesFilter:{types: $types}, recursionTypesFilter: $recursionTypesFilter, validInLanguage: $validInLanguage, limit:1) {
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
`, [nodeCacheRequiredFields.gql]);
