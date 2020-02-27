import {useRef} from 'react';
import {useQuery} from 'react-apollo';
import {NodeInfoQueryHandler} from './useNodeInfo.gql-queries';

export const useNodeInfo = (variables, options) => {
    // Use ref to avoid infinite loop, as query object will be regenerated every time
    const {current: queryHandler} = useRef(new NodeInfoQueryHandler(variables, options));

    const {data, ...others} = useQuery(queryHandler.getQuery(), {variables: queryHandler.getVariables(), skip: queryHandler.fragments.length === 0});

    const node = (data && data.jcr && data.jcr.nodeByPath) || null;

    return {node, ...others};
};
