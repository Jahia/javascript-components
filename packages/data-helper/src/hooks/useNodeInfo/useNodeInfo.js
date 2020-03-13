import {useMemo} from 'react';
import {useQuery} from 'react-apollo';
import {getQuery} from './useNodeInfo.gql-queries';
import {useDeepCompareMemoize} from '../useDeepCompareMemo';
import {getEncodedPermissionName} from '../../fragments/getPermissionFragment';
import {getEncodedNodeTypeName} from '../../fragments/getIsNodeTypeFragment';

export const useNodeInfo = (variables, options) => {
    // Use ref to avoid infinite loop, as query object will be regenerated every time
    const memoizedVariables = useDeepCompareMemoize(variables);
    const memoizedOptions = useDeepCompareMemoize(options);
    const {query, generatedVariables, skip} = useMemo(() => getQuery(memoizedVariables, memoizedOptions), [memoizedVariables, memoizedOptions]);

    const {data, ...others} = useQuery(query, {variables: generatedVariables, skip});

    const node = (data && data.jcr && (data.jcr.nodeByPath || data.jcr.nodeById)) || null;
    const nodes = (data && data.jcr && (data.jcr.nodesByPath || data.jcr.nodesById)) || null;

    if (node) {
        return {
            node: decodeResult(node, memoizedOptions),
            ...others
        };
    }

    if (nodes) {
        return {
            nodes: nodes.map(n => decodeResult(n, memoizedOptions)),
            ...others
        };
    }

    return {
        ...others
    };
};

const decodeResult = (node, options) => {
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
    }

    return node;
};
