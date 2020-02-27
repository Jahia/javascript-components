import {useRef} from 'react';
import {useQuery} from 'react-apollo';
import {replaceFragmentsInDocument} from '../../fragments/fragments.utils';
import {TREE_QUERY} from './useTreeEntries.gql-queries';
import * as _ from 'lodash';

export const useTreeEntries = ({
    fragments,
    rootPaths,
    openPaths,
    selectedPaths,
    openableTypes,
    selectableTypes,
    queryVariables,
    hideRoot
}) => {
    let query = useRef(replaceFragmentsInDocument(TREE_QUERY, fragments));

    const getTreeEntries = (data, selectedPaths, openPaths) => {
        let treeEntries = [];
        let nodesById = {};
        let jcr = data ? data.jcr : {};

        let addNode = function (node, depth, index) {
            let selected = false;
            if (node.selectable) {
                selected = _.indexOf(selectedPaths, node.path) !== -1;
            }

            let treeEntry = {
                name: node.name,
                path: node.path,
                open: node.openable && _.indexOf(openPaths, node.path) !== -1,
                selected: selected,
                openable: node.openable,
                selectable: node.selectable,
                depth: depth,
                prefix: _.repeat('&nbsp;', depth * 3),
                node: node,
                hidden: false,
                hasChildren: node.children.pageInfo.nodesCount > 0
            };
            treeEntries.splice(index, 0, treeEntry);
            nodesById[node.uuid] = treeEntry;
            return treeEntry;
        };

        if (jcr) {
            if (jcr.rootNodes) {
                _.forEach(jcr.rootNodes, rootNode => {
                    let root = addNode(rootNode, 0, 0);
                    root.hidden = hideRoot;
                });
            }

            if (jcr.openNodes) {
                _.sortBy(jcr.openNodes, ['path']).forEach(node => {
                    let parent = nodesById[node.uuid];
                    if (parent) {
                        let parentIndex = _.indexOf(treeEntries, parent);
                        _.forEachRight(node.children.nodes, child => {
                            addNode(child, parent.depth + 1, parentIndex + 1);
                        });
                    }
                });
            }
        }

        // Nodes loaded, fill selection list
        let selectedNodes = _.filter(treeEntries, node => {
            return node.selected;
        }).map(node => {
            return node.node;
        });

        selectedPaths = _.map(selectedNodes, 'path');
        treeEntries = _.filter(treeEntries, treeNode => {
            return !treeNode.hidden;
        });

        return treeEntries;
    };

    let vars = {
        rootPaths: rootPaths,
        types: _.union(openableTypes, selectableTypes),
        selectable: selectableTypes,
        openable: openableTypes,
        openPaths: openPaths
    };

    if (queryVariables) {
        _.assign(vars, queryVariables);
    }

    const {data, ...others} = useQuery(query.current, {variables: vars});
    return {treeEntries: getTreeEntries(data, selectedPaths, openPaths), ...others};
};
