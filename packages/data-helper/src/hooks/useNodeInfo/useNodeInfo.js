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
        const mergeable = mergedQueue.find(q => JSON.stringify(q.queryOptions) === JSON.stringify(value.queryOptions) && (isSubset(q.variables, value.variables) || isSubset(value.variables, q.variables)));

        if (mergeable) {
            merge(mergeable, value);
        } else {
            mergedQueue.push(value);
        }
    });

    mergedQueue.forEach(value => {
        const {variables, queryOptions, options, states} = value;
        const {query, generatedVariables, skip} = getQuery(variables, schemaResult, options);
        if (skip) {
            // No query to execute
            states.forEach(setResult => {
                setResult({
                    loading: false
                });
            });
        } else {
            client
                .watchQuery({query, ...queryOptions, variables: generatedVariables})
                .subscribe(({data, ...others}) => {
                    const refetch = () => {
                        if (client.refetchQueries) {
                            console.log('refetching whole query');
                            client.refetchQueries({include: [query]});
                        } else {
                            console.log('refetch not implemented', variables, options);
                        }
                    };

                    const result = getResult(data, {refetch, ...others}, options, query, generatedVariables);

                    states.forEach(setResult => {
                        setResult(result);
                    });
                });
        }
    });

    queue = [];
    timeout = null;
};

export const useNodeInfo = (variables, options, queryOptions) => {
    const [result, setResult] = useState({
        loading: true
    });

    const client = useApolloClient();

    if (!schemaResult) {
        client.query({query: SCHEMA_FIELDS_QUERY, variables: {type: 'GqlPublicationInfo'}}).then(({data}) => {
            schemaResult = data;
            timeout = setTimeout(() => {
                timeoutHandler(client);
            }, 0);
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
                    console.log('refetch not implemented (cached data)', variables, options);
                };

                return getResult(cachedData, {loading: false, refetch}, options, query, generatedVariables);
            }
        }

        const value = {
            variables: clean(variables),
            queryOptions: clean(queryOptions),
            options: cleanOptions(options),
            states: [setResult]
        };

        queue.push(value);

        if (!timeout && schemaResult) {
            timeout = setTimeout(() => {
                timeoutHandler(client);
            }, 0);
        }

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
