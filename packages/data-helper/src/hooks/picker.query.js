// TODO BACKLOG-12393 - refactor Legacy Picker into hook without lodash
import gql from 'graphql-tag';
import {PredefinedFragments} from '../fragments/PredefinedFragments';

export const PICKER_QUERY = gql`
    query PickerQuery($rootPaths:[String!]!, $selectable:[String]!, $openable:[String]!, $openPaths:[String!]!, $types:[String]!) {
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
                children(typesFilter:{types:$types}) {
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
${PredefinedFragments.nodeCacheRequiredFields.gql}`;
