import {useMemo} from 'react';
import {registry} from '~/registry';
import {getIframeRenderer} from '~/IframeRenderer';
import {Tree, TreeData} from './Tree';
import {StoredService} from '~/registry/service';

export const useAdminRouteTreeStructure = function (target: string, selected: string) {
    const result = useMemo(() => {
        const getAllRoutes = (baseTarget: string, parent = ''): StoredService[] => registry.find({
            type: 'adminRoute',
            target: baseTarget + parent
        })
            .flatMap(route => [route, ...getAllRoutes(baseTarget, '-' + route.key)])
            .map(route => ({
                ...route,
                render: route.render || (typeof route.iframeUrl === 'string' && (() => getIframeRenderer(route.iframeUrl as string)))
            }));

        const routes = getAllRoutes(target);

        const createTree = (baseTarget: string, parent = ''): TreeData[] => registry.find({type: 'adminRoute', target: baseTarget + parent})
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

    const {tree, routes, allPermissions} = result;
    const defaultOpenedItems: string[] = [];

    if (selected) {
        let selectedItem = registry.get('adminRoute', selected);
        while (selectedItem) {
            const parentTarget = selectedItem.targets.find(t => t.id.startsWith(target + '-'));
            if (parentTarget) {
                const parent = parentTarget.id.substr(target.length + 1);
                defaultOpenedItems.push(parent);
                selectedItem = registry.get('adminRoute', parent);
            } else {
                selectedItem = null;
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
