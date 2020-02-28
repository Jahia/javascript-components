import {registry} from './registry';

describe('registry', () => {
    beforeEach(() => {
        registry.clear();
    });

    it('should set key', () => {
        const comp = registry.add('comp', 'test', {foo: 'bar'});
        expect(comp.key).toBe('test');
    });

    it('should register component', () => {
        const comp = registry.add('comp', 'test', {foo: 'bar'});
        expect(registry.get('comp', 'test')).toBe(comp);
    });

    it('should not allow double registration', () => {
        registry.add('comp', 'test', {foo: 'bar'});
        expect(() => registry.add('comp', 'test', {foo: 'bar'})).toThrow(Error);
    });

    it('should allow double registration with addOrReplace', () => {
        registry.add('comp', 'test', {foo: 'bar'});
        expect(() => registry.addOrReplace('comp', 'test', {foo: 'bar'})).not.toThrow(Error);
    });

    it('should clear', () => {
        registry.add('comp', 'test', {foo: 'bar'});
        registry.clear();
        expect(registry.get('comp', 'test')).toBeUndefined();
    });

    it('should find things based on filter', () => {
        registry.add('comp', 'test1', {foo: 'bar'});
        registry.add('comp', 'test2', {foo: 'bar'});
        registry.add('not-a-comp', 'test3', {foo: 'bar'});
        registry.add('comp', 'test3', {foo: 'not-bar'});
        const res = registry.find({type: 'comp', foo: 'bar'});
        expect(res.length).toBe(2);
    });

    it('should find things based on target filter', () => {
        const test1 = registry.add('comp', 'test1', {targets: ['bar']});
        const test2 = registry.add('comp', 'test2', {targets: ['bar']});
        const test3 = registry.add('comp', 'test3', {targets: ['bar']});
        registry.add('comp', 'test4', {targets: ['not-bar']});

        expect(registry.find({type: 'comp', target: 'bar'})).toEqual([test1, test2, test3]);
    });

    it('should find things based on target filter, sorted', () => {
        const test1 = registry.add('comp', 'test1', {targets: ['bar:1']});
        const test2 = registry.add('comp', 'test2', {targets: [{id: 'bar', priority: 3}]});
        const test3 = registry.add('comp', 'test3', {targets: ['bar:2']});

        const res = registry.find({type: 'comp', target: 'bar'});

        expect(res).toEqual([test1, test3, test2]);
    });
});
