import {composeServices} from './composeServices';

class Registry {
    constructor() {
        this.registry = {};
    }

    addOrReplace(type, key) {
        const registryKey = type + '-' + key;

        let actions = Array.prototype.slice.call(arguments, 2);
        const action = composeServices(...actions);
        action.type = type;
        action.key = key;

        if (action.targets) {
            action.targets = action.targets.map(t => {
                if (typeof t === 'string') {
                    const spl = t.split(':');
                    return ({id: spl[0], priority: spl[1] ? spl[1] : 0});
                }

                return t;
            });
        }

        this.registry[registryKey] = action;

        return action;
    }

    add(type, key) {
        const registryKey = type + '-' + key;
        if (this.registry[registryKey]) {
            throw new Error('Entry already exist for key ' + key);
        }

        return this.addOrReplace.apply(this, arguments);
    }

    get(type, key) {
        return this.registry[type + '-' + key];
    }

    find(filters) {
        let result = Object.values(this.registry);
        const {target, ...otherFilters} = filters;
        if (target) {
            result = result
                .filter(item => {
                    return item.targets && item.targets
                        .map(t => t.id)
                        .includes(filters.target);
                })
                .sort((a, b) => {
                    const foundA = a.targets && a.targets.find(t => t.id === filters.target);
                    const foundB = b.targets && b.targets.find(t => t.id === filters.target);
                    const priorityA = foundA && Number(foundA.priority);
                    const priorityB = foundB && Number(foundB.priority);

                    if (isNaN(priorityA) && isNaN(priorityB)) {
                        return 0;
                    }

                    if (isNaN(priorityA)) {
                        return -1;
                    }

                    if (isNaN(priorityB)) {
                        return 1;
                    }

                    return priorityA - priorityB;
                });
        }

        return result.filter(item => {
            // Try to find one key that doesn't match
            return !Object.keys(otherFilters)
                .find(key => {
                    return item[key] !== otherFilters[key];
                });
        });
    }

    clear() {
        this.registry = {};
    }
}

let registry = new Registry();

export {registry};
