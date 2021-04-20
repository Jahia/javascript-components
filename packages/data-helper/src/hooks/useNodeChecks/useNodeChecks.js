import {useNodeInfo} from '../useNodeInfo';

const evaluateVisibilityPaths = (visible, visibilityPaths, nodePath) => {
    for (let i = 0; i < visibilityPaths.length; i++) {
        if (new RegExp(visibilityPaths[i]).test(nodePath)) {
            return visible;
        }
    }

    return !visible;
};

function addArrayOptionValues(newValue, useNodeInfoOptions, useNodeInfoKey) {
    if (newValue) {
        useNodeInfoOptions[useNodeInfoKey] = useNodeInfoOptions[useNodeInfoKey] || [];
        useNodeInfoOptions[useNodeInfoKey] = useNodeInfoOptions[useNodeInfoKey].concat(newValue.filter(item => useNodeInfoOptions[useNodeInfoKey].indexOf(item) < 0));
    }
}

export const useNodeChecks = (variables, options, queryOptions) => {
    const {requiredPermission, requiredSitePermission, showOnNodeTypes, hideOnNodeTypes, requireModuleInstalledOnSite, showForPaths, hideForPaths, ...othersOptions} = options;
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

    const doNodeCheck = node =>
        (!requiredPermissions || requiredPermissions.reduce((acc, val) => acc || node[val], false)) &&
        (!requiredSitePermissions || requiredSitePermissions.reduce((acc, val) => acc || node.site[val], false)) &&
        (!showOnNodeTypes || showOnNodeTypes.reduce((acc, val) => acc || node[val], false)) &&
        (!hideOnNodeTypes || !hideOnNodeTypes.reduce((acc, val) => acc || node[val], false)) &&
        (!requireModuleInstalledOnSite || requireModuleInstalledOnSite.reduce((acc, val) => acc && node.site.installedModulesWithAllDependencies.includes(val), true)) &&
        (!hideForPaths || evaluateVisibilityPaths(false, hideForPaths, node.path || variables.path)) &&
        (!showForPaths || evaluateVisibilityPaths(true, showForPaths, node.path || variables.path));

    const result = node ? doNodeCheck(node) : nodes.reduce((acc, val) => acc && doNodeCheck(val), true);

    return {node, nodes, checksResult: result, loading, ...othersResults};
};
