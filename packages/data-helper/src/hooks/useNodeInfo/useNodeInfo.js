import {useMemo} from 'react';
import {useQuery} from 'react-apollo';
import {getQuery} from './useNodeInfo.gql-queries';
import {useDeepCompareMemoize} from '../useDeepCompareMemo';

export const useNodeInfo = (variables, options) => {
    // Use ref to avoid infinite loop, as query object will be regenerated every time
    const memoizedVariables = useDeepCompareMemoize(variables);
    const memoizedOptions = useDeepCompareMemoize(options);
    const {query, generatedVariables, skip} = useMemo(() => getQuery(memoizedVariables, memoizedOptions), [memoizedVariables, memoizedOptions]);

    const {data, ...others} = useQuery(query, {variables: generatedVariables, skip});

    const node = (data && data.jcr && (data.jcr.nodeByPath || data.jcr.nodeById)) || null;
    const nodes = (data && data.jcr && (data.jcr.nodesByPath || data.jcr.nodesById)) || null;
    return {node, nodes, ...others};
};
