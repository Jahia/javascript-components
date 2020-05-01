import {useNodeInfo} from '../useNodeInfo';

const evaluateVisibilityPaths = (visible, visibilityPaths, nodePath) => {
    for (let i = 0; i < visibilityPaths.length; i++) {
        if (new RegExp(visibilityPaths[i]).test(nodePath)) {
            return visible;
        }
    }

    return !visible;
};

export const useNodeChecks = (variables, options, queryOptions) => {
    const {requiredPermission, showOnNodeTypes, hideOnNodeTypes, requireModuleInstalledOnSite, showForPaths, hideForPaths, ...othersOptions} = options;
    const useNodeInfoOptions = {...othersOptions};

    const requiredPermissions = (typeof requiredPermission === 'string') ? [requiredPermission] : requiredPermission;

    function arrayUnique(array) {
        let a = array.concat();
        for(let i=0; i<a.length; ++i) {
            for(let j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    }

    if (requiredPermissions) {
        useNodeInfoOptions.getPermissions = arrayUnique((useNodeInfoOptions.getPermissions || []).concat(requiredPermissions));
    }

    if (showOnNodeTypes) {
        useNodeInfoOptions.getIsNodeTypes = arrayUnique((useNodeInfoOptions.getIsNodeTypes || []).concat(showOnNodeTypes));
    }

    if (hideOnNodeTypes) {
        useNodeInfoOptions.getIsNodeTypes = arrayUnique((useNodeInfoOptions.getIsNodeTypes || []).concat(hideOnNodeTypes));
    }

    if (requireModuleInstalledOnSite) {
        useNodeInfoOptions.getSiteInstalledModules = true;
    }

    const {node, nodes, loading, ...othersResults} = useNodeInfo(variables, useNodeInfoOptions, queryOptions);

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
