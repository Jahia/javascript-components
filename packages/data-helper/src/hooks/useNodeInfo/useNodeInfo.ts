import {useEffect, useState} from 'react';
import {ApolloClient, ApolloError, NetworkStatus, useApolloClient, WatchQueryOptions} from '@apollo/client';
import {getQuery, NodeInfoOptions, validateQuery} from './useNodeInfo.gql-queries';
import {getEncodedPermissionName} from '../../fragments/getPermissionFragment';
import {getEncodedNodeTypeName} from '../../fragments/getIsNodeTypeFragment';
import {isSubset, merge} from './useNodeInfo.utils';
import {useMemoRequest} from './useMemoRequest';
import deepEquals from 'fast-deep-equal';
import {DocumentNode, GraphQLFormattedError} from 'graphql';
import {getEncodedSubNodesCountName} from '../../fragments/getSubNodesCountFragment';

export type Request = {
    variables:{[key:string]: any},
    options: NodeInfoOptions,
    queryOptions: Partial<WatchQueryOptions>,
}

export type QueuedRequest = Request & {
    result?: any,
    setResult: (data: any) => void
}

export type MergedRequest = Request & { originals: QueuedRequest[] };

export type NodeInfoResult = {
    node?: any,
    nodes?: any[],
    errors?: readonly GraphQLFormattedError[],
    error?: ApolloError,
    loading?: boolean,
    networkStatus?: NetworkStatus,
    partial?: boolean,
    query?: DocumentNode,
    variables?: {[key:string]: any}
}

const queue: QueuedRequest[] = [];
let timeout: number;
let observedQueries: { unsubscribe: () => void }[] = [];

function scheduleQueue(client: ApolloClient<object>) {
    if (!timeout) {
        timeout = window.setTimeout(() => {
            timeoutHandler(client);
            clearTimeout(timeout);
            timeout = null;
        }, 0);
    }
}

const timeoutHandler = (client: ApolloClient<object>) => {
    const mergedQueue: MergedRequest[] = [];

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

    mergedQueue.forEach(mergedRequest => {
        const {variables, queryOptions, options, originals} = mergedRequest;
        let query: any;
        let generatedVariables: any;
        let skip;

        try {
            const r = getQuery(variables, options);
            query = r.query;
            generatedVariables = r.generatedVariables;
            skip = r.skip;
        } catch (e) {
            const error = {message: `One of the batched queries resulted in error: ${e.message}`} as ApolloError;
            originals.forEach(request => {
                request.setResult({
                    loading: false,
                    error
                });
            });
            return;
        }

        if (skip) {
            // No query to execute
            originals.forEach(request => {
                request.setResult({
                    loading: false
                });
            });
        } else {
            const observableQuery = client.watchQuery({query, errorPolicy: 'ignore', ...queryOptions, variables: generatedVariables});
            const subscription = observableQuery.subscribe(({data, ...others}) => {
                const result = getResult(data, others, options, query, generatedVariables);
                originals.forEach(request => {
                    if (!deepEquals(request.result, result)) {
                        request.result = result;
                        request.setResult({
                            ...result,
                            refetch() {
                                return observableQuery.refetch(generatedVariables);
                            }
                        });
                    }
                });
            });
            observedQueries.push(subscription);
        }
    });
};

export const useNodeInfo = (variables: {[key:string]: unknown}, options?: NodeInfoOptions, queryOptions?: Partial<WatchQueryOptions>) => {
    const [result, setResult] = useState<NodeInfoResult>({
        loading: true
    });

    const client = useApolloClient();

    // We do pre-error checks from getQuery and fail faster.
    // This makes issues easier to trace before requests are queued and merged, which is harder to debug.
    let validationError: ApolloError | null = null;
    try {
        validateQuery(variables, options);
    } catch (e) {
        console.error(e);
        validationError = {message: e.message} as ApolloError;
    }

    // Normalize and memoize request
    const [currentRequest, queryHasChanged] = useMemoRequest(variables, queryOptions, options, setResult);
    useEffect(() => {
        if (validationError) {
            return;
        }

        queue.push(currentRequest);
        scheduleQueue(client);

        return () => {
            queue.splice(queue.indexOf(currentRequest), 1);
        };
    }, [client, currentRequest, validationError]);

    // Return early with error if validation failed
    if (validationError) {
        return {loading: false, error: validationError};
    }

    if (queryHasChanged && queryOptions?.fetchPolicy !== 'no-cache' && queryOptions?.fetchPolicy !== 'network-only') {
        let infoQuery;

        try {
            infoQuery = getQuery(currentRequest.variables, currentRequest.options);
        } catch (e) {
            const error = {message: e.message} as ApolloError;
            return {loading: false, error};
        }

        const res = client.readQuery({query: infoQuery.query, variables: infoQuery.generatedVariables});
        if (res) {
            const result = getResult(res, {}, currentRequest.options, infoQuery.query, infoQuery.generatedVariables);
            setResult(result);
            return result;
        }
    }

    if (queryHasChanged && !result.loading) {
        setResult({
            loading: true
        });
        return {loading: true};
    }

    return result;
};

/* eslint-disable max-params */
const getResult = (data: any, others: NodeInfoResult, options: NodeInfoOptions, query: DocumentNode, generatedVariables: {[key:string]: unknown}) => {
    const node: object = (data && data.jcr && (data.jcr.nodeByPath || data.jcr.nodeById)) || null;
    const nodes: object[] = (data && data.jcr && (data.jcr.nodesByPath || data.jcr.nodesById)) || null;
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

const decodeResult = (nodeOrig: any, options: NodeInfoOptions) => {
    const node = {...nodeOrig};
    if (node.site) {
        node.site = {...node.site};
    }

    if (node && options) {
        if (options.getPermissions) {
            options.getPermissions.forEach(name => {
                const res = node[getEncodedPermissionName(name)];
                delete node[getEncodedPermissionName(name)];
                node[name] = res;
            });
        }

        if (options.getSitePermissions) {
            options.getSitePermissions.forEach(name => {
                const res = node.site[getEncodedPermissionName(name)];
                delete node.site[getEncodedPermissionName(name)];
                node.site[name] = res;
            });
        }

        if (options.getIsNodeTypes) {
            options.getIsNodeTypes.forEach(name => {
                const res = node[getEncodedNodeTypeName(name)];
                delete node[getEncodedNodeTypeName(name)];
                node[name] = res;
            });
        }

        if (options.getMimeType) {
            const {nodes} = node.resourceChildren;
            node.mimeType = (nodes.length !== 0 && nodes[0].mimeType.value) || null;
            delete node.resourceChildren;
        }

        if (options.getSubNodesCount) {
            options.getSubNodesCount.forEach(name => {
                const res = node[getEncodedSubNodesCountName(name)];
                delete node[getEncodedSubNodesCountName(name)];
                node['subNodesCount_' + name] = res?.pageInfo?.totalCount;
            });
        }
    }

    return node;
};
