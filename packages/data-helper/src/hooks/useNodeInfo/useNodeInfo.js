import {useMemo} from 'react';
import {useQuery} from 'react-apollo';
import {getQuery} from './useNodeInfo.gql-queries';
import {useDeepCompareMemoize} from '../useDeepCompareMemo';
import {getEncodedPermissionName} from '../../fragments/getPermissionFragment';
import {getEncodedNodeTypeName} from '../../fragments/getIsNodeTypeFragment';
import {useSchemaFields} from '../useSchemaFields';

export const useNodeInfo = (variables, options, queryOptions) => {
    let schemaResult = useSchemaFields({type: 'GqlPublicationInfo'});
    // Use ref to avoid infinite loop, as query object will be regenerated every time
    const memoizedVariables = useDeepCompareMemoize(variables);
    const memoizedOptions = useDeepCompareMemoize(options);

    const {query, generatedVariables, skip, loading} = useMemo(() => getQuery(memoizedVariables, schemaResult, memoizedOptions), [memoizedVariables, schemaResult, memoizedOptions]);

    const {data, ...others} = useQuery(query, {...queryOptions, variables: generatedVariables, skip: (skip || loading)});

    const node = (data && data.jcr && (data.jcr.nodeByPath || data.jcr.nodeById)) || null;
    const nodes = (data && data.jcr && (data.jcr.nodesByPath || data.jcr.nodesById)) || null;

    if (loading) {
        return {loading};
    }

    if (node) {
        return {
            node: decodeResult(node, memoizedOptions),
            ...others,
            query,
            variables: generatedVariables
        };
    }

    if (nodes) {
        return {
            nodes: nodes.map(n => decodeResult(n, memoizedOptions)),
            ...others,
            query,
            variables: generatedVariables
        };
    }

    return {
        ...others
    };
};

const decodeResult = (nodeOrig, options) => {
    let node = {...nodeOrig};
    if (node && options) {
        if (options.getPermissions) {
            options.getPermissions.forEach(name => {
                var res = node[getEncodedPermissionName(name)];
                delete node[getEncodedPermissionName(name)];
                node[name] = res;
            });
        }

        if (options.getIsNodeTypes) {
            options.getIsNodeTypes.forEach(name => {
                var res = node[getEncodedNodeTypeName(name)];
                delete node[getEncodedNodeTypeName(name)];
                node[name] = res;
            });
        }

        if (options.getMimeType) {
            const nodes = node.resourceChildren.nodes;
            node.mimeType = (nodes.length !== 0 && nodes[0].mimeType.value) || null;
            delete node.resourceChildren;
        }
    }

    return node;
};
