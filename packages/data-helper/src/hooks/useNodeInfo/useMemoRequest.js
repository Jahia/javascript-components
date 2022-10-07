import {validOptions} from './useNodeInfo.gql-queries';
import {useRef} from 'react';
import deepEquals from 'fast-deep-equal';

const clean = obj => obj && Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));
const cleanVariables = obj => obj && Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));
const cleanOptions = obj => obj && Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== null && v !== undefined && validOptions.indexOf(k) !== -1));

export function useMemoRequest(variables, queryOptions, options, setResult) {
    variables = cleanVariables(variables);
    queryOptions = clean(queryOptions);
    options = cleanOptions(options);

    const requestValue = {variables, queryOptions, options, setResult};
    const requestRef = useRef(requestValue);

    if (!deepEquals(variables, requestRef.current.variables) || !deepEquals(queryOptions, requestRef.current.queryOptions) || !deepEquals(options, requestRef.current.options)) {
        requestRef.current = requestValue;
    }

    return [requestRef.current, requestRef.current === requestValue];
}
