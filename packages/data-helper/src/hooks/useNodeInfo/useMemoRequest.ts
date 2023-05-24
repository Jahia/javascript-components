import {NodeInfoOptions, validOptions} from './useNodeInfo.gql-queries';
import {useRef} from 'react';
import deepEquals from 'fast-deep-equal';
import {WatchQueryOptions} from '@apollo/client';
import {QueuedRequest} from './useNodeInfo';

const clean = (obj: object) => obj && Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined));
const cleanVariables = (obj: object) => obj && Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined));
const cleanOptions = (obj: NodeInfoOptions) => obj && Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== null && v !== undefined && validOptions.indexOf(k) !== -1));

export function useMemoRequest(variables: {[key:string]: unknown}, queryOptions: Partial<WatchQueryOptions>, options: NodeInfoOptions, setResult: (data:any) => void): [QueuedRequest, boolean] {
    variables = cleanVariables(variables);
    queryOptions = clean(queryOptions);
    options = cleanOptions(options);

    const requestValue = {variables, queryOptions, options, setResult};
    const requestRef = useRef<QueuedRequest>(requestValue);

    if (!deepEquals(variables, requestRef.current.variables) || !deepEquals(queryOptions, requestRef.current.queryOptions) || !deepEquals(options, requestRef.current.options)) {
        requestRef.current = requestValue;
    }

    return [requestRef.current, requestRef.current === requestValue];
}
