import {useEffect, useState} from 'react';
import {useApolloClient} from 'react-apollo';
import {getQuery} from './useNodeInfo.gql-queries';
import {getEncodedPermissionName} from '../../fragments/getPermissionFragment';
import {getEncodedNodeTypeName} from '../../fragments/getIsNodeTypeFragment';
import {SCHEMA_FIELDS_QUERY} from '../useSchemaFields/useSchemaFields.gql-queries';
import {isSubset, merge} from './useNodeInfo.utils';
import {useMemoRequest} from './useMemoRequest';
import deepEquals from 'fast-deep-equal';

let queue = [];
let schemaResult;
let timeout;
let observedQueries = [];

function scheduleQueue(client) {
    if (!timeout && schemaResult) {
        timeout = setTimeout(() => {
            timeoutHandler(client);
            timeout = null;
        }, 0);
    }
}

const timeoutHandler = client => {
    const mergedQueue = [];
    console.log("Merging " + queue.length + " queries");
    const start = Date.now();

    queue.forEach(request => {
        const toInsert = {
            variables: request.variables,
            queryOptions: request.queryOptions,
            options: request.options,
            originals: [request]
        };

        const mergeable = mergedQueue.find(q => JSON.stringify(q.queryOptions) === JSON.stringify(toInsert.queryOptions) && (isSubset(q.variables, toInsert.variables) || isSubset(toInsert.variables, q.variables)));

        if (mergeable) {
            merge(mergeable, toInsert);
        } else {
            mergedQueue.push({
                variables: toInsert.variables && {...toInsert.variables},
                queryOptions: toInsert.queryOptions && {...toInsert.queryOptions},
                options: toInsert.options && {...toInsert.options},
                originals: toInsert.originals
            });
        }
    });

    observedQueries.forEach(obs => obs.unsubscribe());
    observedQueries = [];

    const millis = Date.now() - start;

    console.log("Merged : " + mergedQueue.length + " in " + millis + "ms", mergedQueue);

    mergedQueue.forEach(mergedRequest => {
        const {variables, queryOptions, options, originals} = mergedRequest;
        const {query, generatedVariables, skip} = getQuery(variables, schemaResult, options);
        if (skip) {
            // No query to execute
            originals.forEach(request => {
                request.setResult({
                    loading: false
                });
            });
        } else {
            const watchedQuery = client.watchQuery({query, errorPolicy: 'ignore', ...queryOptions, variables: generatedVariables}).subscribe(({data, ...others}) => {
                const result = getResult(data, others, options, query, generatedVariables);

                originals.forEach(request => {
                    if (!deepEquals(request.result, result)) {
                        request.result = result;
                        request.setResult({
                            ...result,
                            refetch: () => {
                                client.refetchQueries({include: [query]});
                            }
                        });
                    }
                });
            });
            observedQueries.push(watchedQuery);
        }
    });
};

export const useNodeInfo = (variables, options, queryOptions) => {
    const [result, setResult] = useState({
        loading: true
    });

    const client = useApolloClient();

    if (!schemaResult) {
        client.query({query: SCHEMA_FIELDS_QUERY, variables: {type: 'GqlPublicationInfo'}}).then(({data}) => {
            schemaResult = data;
            scheduleQueue(client);
        });
    }

    // Normalize and memoize request
    const [currentRequest, changed] = useMemoRequest(variables, queryOptions, options, setResult);
    useEffect(() => {
        queue.push(currentRequest);
        scheduleQueue(client);

        return () => {
            queue.splice(queue.indexOf(currentRequest), 1);
        };
    }, [currentRequest]);

    // if (changed && schemaResult) {
    //     // Use cache only if schemaResult is available
    //     const {query, generatedVariables, skip} = getQuery(currentRequest.variables, schemaResult, currentRequest.options);
    //     if (skip) {
    //         console.log('skip ', currentRequest);
    //         return {
    //             loading: false
    //         };
    //     }
    //
    //     const cachedData = client.readQuery({query, ...currentRequest.queryOptions, variables: generatedVariables});
    //     if (cachedData) {
    //         console.log('from cache ', currentRequest);
    //         currentRequest.cachedResult = true;
    //         const refetch = () => {};
    //         return getResult(cachedData, {loading: false, refetch}, currentRequest.options, query, generatedVariables);
    //     }
    // }

    return result;
};

const getResult = (data, others, options, query, generatedVariables) => {
    const node = (data && data.jcr && (data.jcr.nodeByPath || data.jcr.nodeById)) || null;
    const nodes = (data && data.jcr && (data.jcr.nodesByPath || data.jcr.nodesById)) || null;
    let result = others;

    if (node) {
        result = {
            node: decodeResult(node, options),
            ...others,
            query,
            variables: generatedVariables
        };
    }

    if (nodes) {
        result = {
            nodes: nodes.map(n => decodeResult(n, options)),
            ...others,
            query,
            variables: generatedVariables
        };
    }

    return result;
};

const decodeResult = (nodeOrig, options) => {
    let node = {...nodeOrig};
    if (node.site) {
        node.site = {...node.site};
    }

    if (node && options) {
        if (options.getPermissions) {
            options.getPermissions.forEach(name => {
                var res = node[getEncodedPermissionName(name)];
                delete node[getEncodedPermissionName(name)];
                node[name] = res;
            });
        }

        if (options.getSitePermissions) {
            options.getSitePermissions.forEach(name => {
                var res = node.site[getEncodedPermissionName(name)];
                delete node.site[getEncodedPermissionName(name)];
                node.site[name] = res;
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
