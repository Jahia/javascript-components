import {useMemo} from 'react';
import {useQuery} from 'react-apollo';
import {getQuery} from './useNodeInfo.gql-queries';
import {useDeepCompareMemoize} from '../useDeepCompareMemo';

export const useNodeInfo = (variables, options) => {
    // Use ref to avoid infinite loop, as query object will be regenerated every time
    const memoizedVariables = useDeepCompareMemoize(variables);
    const memoizedOptions = useDeepCompareMemoize(options);
    const {query, generatedVariables, fragments} = useMemo(() => getQuery(memoizedVariables, memoizedOptions), [memoizedVariables, memoizedOptions]);

    const {data, ...others} = useQuery(query, {variables: generatedVariables, skip: fragments.length === 0});

    const node = (data && data.jcr && data.jcr.nodeByPath) || null;

    return {node, ...others};
};
