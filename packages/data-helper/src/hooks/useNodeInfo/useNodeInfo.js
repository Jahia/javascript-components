import {useRef} from 'react';
import {useQuery} from 'react-apollo';
import {getQuery} from './useNodeInfo.gql-queries';

export const useNodeInfo = (variables, options) => {
    // Use ref to avoid infinite loop, as query object will be regenerated every time
    const {current: {query, generatedVariables, fragments}} = useRef(getQuery(variables, options));

    const {data, ...others} = useQuery(query, {variables: generatedVariables, skip: fragments.length === 0});

    const node = (data && data.jcr && data.jcr.nodeByPath) || null;

    return {node, ...others};
};
