import * as _ from 'lodash';
import {composeServices} from './composeServices';

class Registry {
    constructor() {
        this.registry = {};
    }

    addOrReplace(type, key) {
        const registryKey = type + '-' + key;

        let actions = Array.prototype.slice.call(arguments, 2);
        let action = composeServices(...actions);
        action.type = type;
        action.key = key;

        if (action.targets) {
            action.targets = action.targets.map(t => {
                if (typeof t === 'string') {
                    let spl = t.split(':');
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
            result = result.filter(item => _.includes(item.targets && item.targets.map(t => t.id), filters.target));
            result = _.sortBy(result, [function (o) {
                let found = _.find(o.targets, function (t) {
                    return t.id === filters.target;
                });
                return found && found.priority && found.priority !== 0 ? found.priority : 'undefined';
            }]);
        }

        return _.filter(result, otherFilters);
    }

    clear() {
        this.registry = {};
    }
}

let registry = new Registry();

export {registry};
