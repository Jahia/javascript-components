import {composeServices} from './composeServices';
import {Service, StoredService} from './service';

class Registry {
    registry: Record<string, StoredService>;

    constructor() {
        this.registry = {};
    }

    addOrReplace(type: string, key: string, ...services: Array<Partial<Service>>): StoredService {
        const registryKey = type + '-' + key;

        const service = composeServices(...services);
        const targets = service.targets?.map(t => {
            if (typeof t === 'string') {
                const [id, priority = '0'] = t.split(':');
                return ({id, priority: Number(priority)});
            }

            return t;
        }) ?? [];

        const storedService: StoredService = {
            ...service,
            targets,
            type,
            key
        };
        this.registry[registryKey] = storedService;

        return storedService;
    }

    add(type: string, key: string, ...services: Array<Partial<Service>>): StoredService {
        const registryKey = type + '-' + key;
        if (this.registry[registryKey]) {
            throw new Error('Entry already exist for key ' + key);
        }

        return this.addOrReplace(type, key, ...services);
    }

    get(type: string, key: string): StoredService {
        return this.registry[type + '-' + key];
    }

    remove(type: string, key: string): void {
        if (key) {
            const registryKey = type + '-' + key;
            if (this.registry[registryKey]) {
                delete this.registry[type + '-' + key];
            }
        } else {
            const entries = this.find({type});
            if (entries) {
                entries.forEach(entry => this.remove(type, entry.key));
            }
        }
    }

    find(filters: {target?:string, [key:string]: unknown}): StoredService[] {
        let result = Object.values(this.registry);
        const {target, ...otherFilters} = filters;
        if (target) {
            result = result
                .filter(item => item.targets?.map(t => t.id).includes(target))
                .sort((a, b) => {
                    const foundA = a.targets && a.targets.find(t => t.id === filters.target);
                    const foundB = b.targets && b.targets.find(t => t.id === filters.target);
                    const priorityA = foundA && Number(foundA.priority);
                    const priorityB = foundB && Number(foundB.priority);

                    if ((priorityA === undefined || isNaN(priorityA)) && (priorityB === undefined || isNaN(priorityB))) {
                        return 0;
                    }

                    if (priorityA === undefined || isNaN(priorityA)) {
                        return -1;
                    }

                    if (priorityB === undefined || isNaN(priorityB)) {
                        return 1;
                    }

                    return priorityA - priorityB;
                });
        }

        return result.filter(item =>
            // Try to find one key that doesn't match
            !Object.keys(otherFilters)
                .find(key => item[key] !== otherFilters[key])
        );
    }

    clear() {
        this.registry = {};
    }
}

export const registry = new Registry();
