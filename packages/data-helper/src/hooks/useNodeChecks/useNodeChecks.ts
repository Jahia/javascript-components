import {NodeInfoResult, useNodeInfo} from '~/hooks';
import {NodeInfoOptions} from '../useNodeInfo/useNodeInfo.gql-queries';
import { WatchQueryOptions} from '@apollo/client';

export type NodeCheckOptions = NodeInfoOptions & Partial<{
    requiredPermission: string | string[],
    requiredSitePermission: string | string[],
    showOnNodeTypes: string[],
    hideOnNodeTypes: string[],
    requireModuleInstalledOnSite: string[],
    showForPaths: string[],
    hideForPaths: string[],
    hideOnExternal: boolean,
    mapResults: boolean
}>

export type NodeCheckResult = NodeInfoResult & Partial<{
    checksResult: boolean,
}>

const evaluateVisibilityPaths = (visible: boolean, visibilityPaths: string[], nodePath: string) => {
    for (let i = 0; i < visibilityPaths.length; i++) {
        if (new RegExp(visibilityPaths[i]).test(nodePath)) {
            return visible;
        }
    }

    return !visible;
};

function addArrayOptionValues(newValue: string[], useNodeInfoOptions: NodeInfoOptions, useNodeInfoKey: 'getPermissions' | 'getSitePermissions' |'getIsNodeTypes'| 'getProperties') {
    if (newValue) {
        useNodeInfoOptions[useNodeInfoKey] = useNodeInfoOptions[useNodeInfoKey] || [];
        useNodeInfoOptions[useNodeInfoKey] = useNodeInfoOptions[useNodeInfoKey].concat(newValue.filter(item => useNodeInfoOptions[useNodeInfoKey].indexOf(item) < 0));
    }
}

export const useNodeChecks = (variables: {[key:string]: any}, options?: NodeCheckOptions, queryOptions?: WatchQueryOptions): NodeCheckResult => {
    const {requiredPermission, requiredSitePermission, showOnNodeTypes, hideOnNodeTypes, requireModuleInstalledOnSite, showForPaths, hideForPaths, hideOnExternal, ...othersOptions} = options;
    const useNodeInfoOptions = {...othersOptions};

    const requiredPermissions = (typeof requiredPermission === 'string') ? [requiredPermission] : requiredPermission;
    const requiredSitePermissions = (typeof requiredSitePermission === 'string') ? [requiredSitePermission] : requiredSitePermission;

    addArrayOptionValues(requiredPermissions, useNodeInfoOptions, 'getPermissions');
    addArrayOptionValues(requiredSitePermissions, useNodeInfoOptions, 'getSitePermissions');
    addArrayOptionValues(showOnNodeTypes, useNodeInfoOptions, 'getIsNodeTypes');
    addArrayOptionValues(hideOnNodeTypes, useNodeInfoOptions, 'getIsNodeTypes');

    if (requireModuleInstalledOnSite) {
        useNodeInfoOptions.getSiteInstalledModules = true;
    }

    const {node, nodes, loading, ...othersResults} = useNodeInfo(variables, useNodeInfoOptions, queryOptions);

    if (loading) {
        return {loading, ...othersResults};
    }

    if (!node && !nodes) {
        return {checksResult: false, loading, ...othersResults};
    }

    const doNodeCheck = (currentNode: any) =>
        (!requiredPermissions || requiredPermissions.reduce((acc, val) => acc || currentNode[val], false)) &&
        (!requiredSitePermissions || requiredSitePermissions.reduce((acc, val) => acc || currentNode.site[val], false)) &&
        (!showOnNodeTypes || showOnNodeTypes.reduce((acc, val) => acc || currentNode[val], false)) &&
        (!hideOnNodeTypes || !hideOnNodeTypes.reduce((acc, val) => acc || currentNode[val], false)) &&
        (!requireModuleInstalledOnSite || requireModuleInstalledOnSite.reduce((acc, val) => acc && currentNode.site.installedModulesWithAllDependencies.includes(val), true)) &&
        (!hideForPaths || evaluateVisibilityPaths(false, hideForPaths, currentNode.path || variables.path)) &&
        (!showForPaths || evaluateVisibilityPaths(true, showForPaths, currentNode.path || variables.path)) &&
        (!hideOnExternal || !currentNode.isExternal);

    const map = options?.mapResults;
    const result = node ? doNodeCheck(node) : nodes.reduce((acc, val) => {
        const r = doNodeCheck(val);
        val.checksResult = r;

        if (map) {
            acc.nodes[val.path] = val;
        }

        acc.checksResult = acc.checksResult && r;
        return acc;
    }, map ? {nodes: {}, checksResult: true} : {checksResult: true});

    return {
        node,
        nodes: map ? result.nodes : nodes,
        checksResult: result.checksResult,
        loading,
        ...othersResults
    };
};
