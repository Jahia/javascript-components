import {useRef} from 'react';
import {useQuery} from 'react-apollo';
import {replaceFragmentsInDocument} from '../../fragments/fragments.utils';
import {TREE_QUERY} from './useTreeEntries.gql-queries';

export const useTreeEntries = ({
    fragments,
    rootPaths,
    openPaths,
    selectedPaths,
    openableTypes,
    selectableTypes,
    recursionTypesFilter,
    queryVariables,
    hideRoot,
    sortBy
}, queryOptions) => {
    let query = useRef(replaceFragmentsInDocument(TREE_QUERY, fragments));

    const getTreeEntries = (data, selectedPaths, openPaths) => {
        const treeEntries = [];
        const nodesById = {};
        const jcr = data ? data.jcr : {};

        const addNode = function (node, depth, index) {
            let selected = false;
            if (node.selectable) {
                selected = selectedPaths.indexOf(node.path) !== -1;
            }

            let treeEntry = {
                name: node.name,
                path: node.path,
                open: node.openable && openPaths.indexOf(node.path) !== -1,
                selected: selected,
                openable: node.openable,
                selectable: node.selectable,
                depth: depth,
                prefix: '&nbsp;'.repeat(depth * 3),
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
                jcr.rootNodes.forEach(rootNode => {
                    let root = addNode(rootNode, 0, 0);
                    root.hidden = hideRoot;
                });
            }

            if (jcr.openNodes) {
                [...jcr.openNodes].sort((a, b) => a.path.localeCompare(b.path)).forEach(node => {
                    const parent = nodesById[node.uuid];
                    if (parent) {
                        const parentIndex = treeEntries.indexOf(parent);
                        [...node.children.nodes].reverse().forEach(child => {
                            addNode(child, parent.depth + 1, parentIndex + 1);
                        });
                    }
                });
            }
        }

        // Nodes loaded, fill selection list
        selectedPaths = treeEntries.filter(node => node.selected).map(node => node.node.path);

        return treeEntries.filter(treeNode => !treeNode.hidden);
    };

    let vars = {
        rootPaths: rootPaths,
        types: Array.from(new Set([...openableTypes, ...selectableTypes])),
        recursionTypesFilter: recursionTypesFilter || {types: 'nt:base', multi: 'NONE'},
        selectable: selectableTypes,
        openable: openableTypes,
        openPaths: openPaths,
        sortBy,
        ...queryVariables
    };

    const {data, ...others} = useQuery(query.current, {...queryOptions, variables: vars});
    return {treeEntries: getTreeEntries(data, selectedPaths, openPaths), ...others};
};
