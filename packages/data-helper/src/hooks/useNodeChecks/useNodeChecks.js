import {useNodeInfo} from '../useNodeInfo';

const evaluateVisibilityPaths = (visible, visibilityPaths, nodePath) => {
    for (let i = 0; i < visibilityPaths.length; i++) {
        if (new RegExp(visibilityPaths[i]).test(nodePath)) {
            return visible;
        }
    }

    return !visible;
};

export const useNodeChecks = (variables, options) => {
    const {requiredPermission, showOnNodeTypes, hideOnNodeTypes, requireModuleInstalledOnSite, showForPaths, hideForPaths, ...othersOptions} = options;
    const useNodeInfoOptions = {...othersOptions};

    const requiredPermissions = (typeof requiredPermission === 'string') ? [requiredPermission] : requiredPermission;

    if (requiredPermissions) {
        useNodeInfoOptions.getPermissions = useNodeInfoOptions.getPermissions || [];
        useNodeInfoOptions.getPermissions.push(...requiredPermissions);
    }

    if (showOnNodeTypes) {
        useNodeInfoOptions.getIsNodeTypes = useNodeInfoOptions.getIsNodeType || [];
        useNodeInfoOptions.getIsNodeTypes.push(...showOnNodeTypes);
    }

    if (hideOnNodeTypes) {
        useNodeInfoOptions.getIsNodeTypes = useNodeInfoOptions.getIsNodeType || [];
        useNodeInfoOptions.getIsNodeTypes.push(...hideOnNodeTypes);
    }

    if (requireModuleInstalledOnSite) {
        useNodeInfoOptions.getSiteInstalledModules = true;
    }

    const {node, nodes, loading, ...othersResults} = useNodeInfo(variables, useNodeInfoOptions);

    if (loading) {
        return {loading, ...othersResults};
    }

    if (!node && !nodes) {
        return {checksResult: false, loading};
    }

    const doNodeCheck = node =>
        (!requiredPermissions || requiredPermissions.reduce((acc, val) => acc || node[val], false)) &&
        (!showOnNodeTypes || showOnNodeTypes.reduce((acc, val) => acc || node[val], false)) &&
        (!hideOnNodeTypes || !hideOnNodeTypes.reduce((acc, val) => acc || node[val], false)) &&
        (!requireModuleInstalledOnSite || requireModuleInstalledOnSite.reduce((acc, val) => acc && node.site.installedModulesWithAllDependencies.includes(val), true)) &&
        (!hideForPaths || evaluateVisibilityPaths(false, hideForPaths, node.path || variables.path)) &&
        (!showForPaths || evaluateVisibilityPaths(true, showForPaths, node.path || variables.path));

    const result = node ? doNodeCheck(node) : nodes.reduce((acc, val) => acc && doNodeCheck(val), true);

    return {node, nodes, checksResult: result, loading, ...othersResults};
};
