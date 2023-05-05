import {registry} from '../registry';
import {useAdminRouteTreeStructure} from './useAdminRoutesTreeStructure';

jest.mock('react', () => ({
    useMemo: v => v()
}));

jest.mock('../IframeRenderer', () => {});

describe('useAdminRoutesTreeStructure', () => {
    beforeEach(() => {
        registry.clear();
    });

    it('should get the items', () => {
        registry.addOrReplace('adminRoute', 'route1', {
            targets: ['test:1'],
            isSelectable: false,
            label: 'test route 1'
        });
        registry.addOrReplace('adminRoute', 'route2', {
            targets: ['test:2'],
            isSelectable: true,
            label: 'test route 2'
        });
        registry.addOrReplace('adminRoute', 'route3', {
            targets: ['test:3'],
            isSelectable: true,
            label: 'test route 3'
        });

        const {tree, routes} = useAdminRouteTreeStructure('test');

        expect(routes.length).toBe(3);
        expect(tree.getData().length).toBe(3);
    });

    it('should create a tree', () => {
        registry.addOrReplace('adminRoute', 'mainRoute', {
            targets: ['test:1'],
            isSelectable: false,
            label: 'test route 1'
        });
        registry.addOrReplace('adminRoute', 'subroute-2', {
            targets: ['test-mainRoute:1'],
            isSelectable: true,
            label: 'test route 2'
        });
        registry.addOrReplace('adminRoute', 'subroute-3', {
            targets: ['test-mainRoute:2'],
            isSelectable: true,
            label: 'test route 3'
        });

        const {tree, routes} = useAdminRouteTreeStructure('test');

        expect(routes.length).toBe(3);
        expect(tree.getData().length).toBe(1);
        expect(tree.getData()[0].children.length).toBe(2);
    });

    it('should open the tree', () => {
        registry.addOrReplace('adminRoute', 'mainRoute', {
            targets: ['test:1'],
            isSelectable: false,
            label: 'test route 1'
        });
        registry.addOrReplace('adminRoute', 'subroute', {
            targets: ['test-mainRoute:1'],
            isSelectable: true,
            label: 'test route 2'
        });
        registry.addOrReplace('adminRoute', 'subsubroute', {
            targets: ['test-subroute:1'],
            isSelectable: true,
            label: 'test route 3'
        });

        const {defaultOpenedItems} = useAdminRouteTreeStructure('test', 'subsubroute');

        console.log(defaultOpenedItems);

        expect(defaultOpenedItems.length).toBe(2);
        expect(defaultOpenedItems).toContain('mainRoute');
        expect(defaultOpenedItems).toContain('subroute');
    });

    it('should gather permissions', () => {
        registry.addOrReplace('adminRoute', 'mainRoute', {
            targets: ['test:1'],
            isSelectable: false,
            requiredPermission: 'xx1',
            label: 'test route 1'
        });
        registry.addOrReplace('adminRoute', 'subroute', {
            targets: ['test-mainRoute:1'],
            isSelectable: true,
            requiredPermission: 'xx2',
            label: 'test route 2'
        });
        registry.addOrReplace('adminRoute', 'subsubroute', {
            targets: ['test-subroute:1'],
            isSelectable: true,
            requiredPermission: 'xx1',
            label: 'test route 3'
        });

        const {allPermissions} = useAdminRouteTreeStructure('test', 'subsubroute');

        expect(allPermissions.length).toBe(2);
        expect(allPermissions).toContain('xx1');
        expect(allPermissions).toContain('xx2');
    });

    it('should filter tree', () => {
        registry.addOrReplace('adminRoute', 'mainRoute', {
            targets: ['test:1'],
            isSelectable: false,
            isMainNode: true,
            label: 'test route 1'
        });
        registry.addOrReplace('adminRoute', 'subroute', {
            targets: ['test-mainRoute:1'],
            isSelectable: true,
            label: 'test route 2'
        });

        const {tree} = useAdminRouteTreeStructure('test');

        expect(tree.filter(item => item.isSelectable).getData().length).toBe(0);
        expect(tree.filter(item => item.isMainNode).getData().length).toBe(1);
        expect(tree.filter(item => item.isMainNode).getData()[0].children.length).toBe(0);
    });

    it('should map tree', () => {
        registry.addOrReplace('adminRoute', 'mainRoute', {
            targets: ['test:1'],
            isSelectable: false,
            isMainNode: true,
            label: 'test route 1'
        });
        registry.addOrReplace('adminRoute', 'subroute', {
            targets: ['test-mainRoute:1'],
            isSelectable: true,
            label: 'test route 2'
        });

        const {tree} = useAdminRouteTreeStructure('test');

        expect(tree.map(item => ({value: item.label})).getData()[0].value).toBe('test route 1');
        expect(tree.map(item => ({value: item.label})).getData()[0].children[0].value).toBe('test route 2');
    });
});
