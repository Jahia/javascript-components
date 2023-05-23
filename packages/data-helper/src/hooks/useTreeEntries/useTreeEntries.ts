import {QueryHookOptions, useQuery} from '@apollo/client';
import {replaceFragmentsInDocument} from '../../fragments/fragments.utils';
import {TREE_QUERY} from './useTreeEntries.gql-queries';
import {Fragment} from '~/fragments';

export type UseTreeEntriesArgs = Partial<{
    fragments: (string|Fragment)[],
    rootPaths: string[],
    openPaths: string[],
    selectedPaths: string[],
    openableTypes: string[],
    selectableTypes: string[],
    recursionTypesFilter: object,
    queryVariables: {[key:string]: any},
    hideRoot: boolean,
    sortBy: string,
}>

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
}: UseTreeEntriesArgs, queryOptions: QueryHookOptions) => {
    const query = replaceFragmentsInDocument(TREE_QUERY, fragments);

    const getTreeEntries = (data: any) => {
        const treeEntries: any[] = [];
        const nodesById: {[key:string]: any} = {};
        const jcr: any = data ? data.jcr : {};

        const addNode = function (node: any, depth: number, index: number) {
            let selected = false;
            if (node.selectable) {
                selected = selectedPaths.indexOf(node.path) !== -1;
            }

            const treeEntry = {
                name: node.name,
                path: node.path,
                open: node.openable && openPaths.indexOf(node.path) !== -1,
                selected,
                openable: node.openable,
                selectable: node.selectable,
                depth,
                prefix: '&nbsp;'.repeat(depth * 3),
                node,
                hidden: false,
                hasChildren: node.children.pageInfo.nodesCount > 0
            };
            treeEntries.splice(index, 0, treeEntry);
            nodesById[node.uuid] = treeEntry;
            return treeEntry;
        };

        if (jcr) {
            if (jcr.rootNodes) {
                jcr.rootNodes.forEach((rootNode: any) => {
                    const root = addNode(rootNode, 0, 0);
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

        return treeEntries.filter(treeNode => !treeNode.hidden);
    };

    const vars = {
        rootPaths,
        types: Array.from(new Set([...(openableTypes || []), ...(selectableTypes || [])])),
        recursionTypesFilter: recursionTypesFilter || {types: 'nt:base', multi: 'NONE'},
        selectable: selectableTypes,
        openable: openableTypes,
        openPaths,
        sortBy,
        ...queryVariables
    };

    const {data, ...others} = useQuery(query, {...queryOptions, variables: vars});
    return {treeEntries: getTreeEntries(data), ...others};
};
