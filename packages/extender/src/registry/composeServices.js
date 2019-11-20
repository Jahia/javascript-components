import * as _ from 'lodash';

function composeServices() {
    let actions = Array.prototype.slice.call(arguments);
    return actions.reduce((acc, action) => {
        if (action) {
            Object.entries(action).forEach(([key, value]) => {
                let previous = acc[key];
                if (typeof previous === 'function') {
                    acc[key] = () => {
                        previous.apply(this, arguments);
                        value.apply(this, arguments);
                    };
                } else if (Array.isArray(previous)) {
                    acc[key] = _.concat(previous, value);
                } else {
                    acc[key] = value;
                }
            });
        }

        return acc;
    }, {});
}

export {composeServices};
