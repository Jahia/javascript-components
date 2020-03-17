import {useMemo} from 'react';
import {registry} from '../registry';
import {getIframeRenderer} from '../IframeRenderer';
import {Tree} from './Tree';

export const useAdminRouteTreeStructure = function (target, selected) {
    const {tree, routes, allPermissions} = useMemo(() => {
        const getAllRoutes = (baseTarget, parent = '') => registry.find({
            type: 'adminRoute',
            target: baseTarget + parent
        })
            .flatMap(route => {
                return [route, ...getAllRoutes(baseTarget, '-' + route.key)];
            })
            .map(route => ({
                ...route,
                render: route.render || (route.iframeUrl && (() => getIframeRenderer(route.iframeUrl)))
            }));

        const routes = getAllRoutes(target);

        const createTree = (baseTarget, parent = '') => registry.find({type: 'adminRoute', target: baseTarget + parent})
            .filter(route => !route.omitFromTree)
            .map(route => ({
                ...route,
                children: createTree(baseTarget, '-' + route.key)
            }));

        const tree = new Tree(createTree(target));

        const allPermissions = routes
            .filter(route => route.requiredPermission)
            .map(route => route.requiredPermission)
            .filter((item, pos, self) => self.indexOf(item) === pos);

        return {
            routes, tree, allPermissions
        };
    }, [target]);

    let defaultOpenedItems = [];

    if (selected) {
        let selectedItem = registry.get('adminRoute', selected);
        while (selectedItem) {
            const parentTarget = selectedItem.targets.find(t => t.id.startsWith(target + '-'));
            if (parentTarget) {
                const parent = parentTarget.id.substr(target.length + 1);
                defaultOpenedItems.push(parent);
                selectedItem = registry.get('adminRoute', parent);
            } else {
                selectedItem = false;
            }
        }
    }

    return {
        tree,
        defaultOpenedItems,
        routes,
        allPermissions
    };
};
