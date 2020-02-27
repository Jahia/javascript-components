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

    if (requiredPermission) {
        useNodeInfoOptions.getPermissions = useNodeInfoOptions.getPermissions || [];
        useNodeInfoOptions.getPermissions.push(...requiredPermission);
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

    const {node, loading, ...othersResults} = useNodeInfo(variables, useNodeInfoOptions);

    if (loading) {
        return {loading, ...othersResults};
    }

    const result = (!requiredPermission || requiredPermission.map(t => t.replace(':', '_')).reduce((acc, val) => acc || node[val], false)) &&
        (!showOnNodeTypes || showOnNodeTypes.map(t => t.replace(':', '_')).reduce((acc, val) => acc || node[val], false)) &&
        (!hideOnNodeTypes || !hideOnNodeTypes.map(t => t.replace(':', '_')).reduce((acc, val) => acc || node[val], false)) &&
        (!requireModuleInstalledOnSite || requireModuleInstalledOnSite.reduce((acc, val) => acc && node.site.installedModulesWithAllDependencies.includes(val), true)) &&
        (!hideForPaths || evaluateVisibilityPaths(false, hideForPaths, node.path || variables.path)) &&
        (!showForPaths || evaluateVisibilityPaths(true, showForPaths, node.path || variables.path));

    return {node, checksResult: result, loading, ...othersResults};
};
