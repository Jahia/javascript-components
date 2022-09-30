import {useState} from 'react';
import {useApolloClient} from 'react-apollo';
import {getQuery, validOptions} from './useNodeInfo.gql-queries';
import {getEncodedPermissionName} from '../../fragments/getPermissionFragment';
import {getEncodedNodeTypeName} from '../../fragments/getIsNodeTypeFragment';
import {SCHEMA_FIELDS_QUERY} from '../useSchemaFields/useSchemaFields.gql-queries';

let queue = [];
let schemaResult;
let timeout;

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

const merge = (target, source) => {
    if (Array.isArray(target) && Array.isArray(source)) {
        target.push(...source.filter(f => target.indexOf(f) === -1));
        return target;
    }

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(sourceKey => {
            const sourceValue = source[sourceKey];
            if (Object.prototype.hasOwnProperty.call(target, sourceKey)) {
                const targetValue = target[sourceKey];
                target[sourceKey] = merge(targetValue, sourceValue);
            } else {
                target[sourceKey] = sourceValue;
            }
        });

        return target;
    }

    return target;
};

const isSubset = (superObj, subObj) => {
    return Object.keys(subObj).every(ele => {
        if (typeof subObj[ele] === 'object' && !Array.isArray(subObj[ele])) {
            return isSubset(superObj[ele], subObj[ele]);
        }

        return subObj[ele] === superObj[ele];
    });
};

const clean = obj => obj && Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));
const cleanOptions = obj => obj && Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== null && v !== undefined && validOptions.indexOf(k) !== -1));

function getResult(data, others, options, query, generatedVariables) {
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
}

const timeoutHandler = client => {
    const mergedQueue = [];
    queue.forEach(value => {
        const toInsert = {
            variables: clean(value.variables),
            queryOptions: clean(value.queryOptions),
            options: cleanOptions(value.options),
            originals: [value]
        };

        const mergeable = mergedQueue.find(q => JSON.stringify(q.queryOptions) === JSON.stringify(toInsert.queryOptions) && (isSubset(q.variables, toInsert.variables) || isSubset(toInsert.variables, q.variables)));

        if (mergeable) {
            merge(mergeable, toInsert);
        } else {
            mergedQueue.push(toInsert);
        }
    });

    mergedQueue.forEach(value => {
        const {variables, queryOptions, options, originals} = value;
        const {query, generatedVariables, skip} = getQuery(variables, schemaResult, options);
        if (skip) {
            // No query to execute
            originals.forEach(value => {
                value.setResult({
                    loading: false
                });
            });
        } else {
            client.query({query, errorPolicy: 'ignore', ...queryOptions, variables: generatedVariables}).then(({data, ...others}) => {
                const result = getResult(data, others, options, query, generatedVariables);

                originals.forEach(value => {
                    value.setResult({
                        ...result,
                        refetch: () => {
                            queue.push({...value, queryOptions: {...value.queryOptions, fetchPolicy: 'network-only'}});
                            scheduleQueue(client);
                        }
                    });
                });
            });
        }
    });

    queue = [];
    timeout = null;
};

function scheduleQueue(client) {
    if (!timeout && schemaResult) {
        timeout = setTimeout(() => {
            timeoutHandler(client);
        }, 0);
    }
}

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

    if (!result.queued && result.loading) {
        if (schemaResult) {
            // Use cache only if schemaResult is available
            const {query, generatedVariables, skip} = getQuery(variables, schemaResult, options);
            if (skip) {
                return {
                    loading: false
                };
            }

            const cachedData = client.readQuery({query, ...queryOptions, variables: generatedVariables});
            if (cachedData) {
                const refetch = () => {
                    queue.push({variables, queryOptions: {...queryOptions, fetchPolicy: 'network-only'}, options, setResult});
                    scheduleQueue(client);
                    console.log('refetch not implemented (cached data)', variables, options);
                };

                return getResult(cachedData, {loading: false, refetch}, options, query, generatedVariables);
            }
        }

        queue.push({variables, queryOptions, options, setResult});
        scheduleQueue(client);

        setResult({...result, queued: true});
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
