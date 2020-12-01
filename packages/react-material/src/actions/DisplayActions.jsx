import React from 'react';
import PropTypes from 'prop-types';
import {actionsRegistry} from './actionsRegistry';
import * as _ from 'lodash';
import {DisplayAction} from './DisplayAction';

class DisplayActions extends React.Component {
    constructor(props) {
        super(props);
        this.observerRefs = [];
    }

    render() {
        const {target, context, render, filter} = this.props;

        let actionsToDisplay = _.filter(actionsRegistry.getAll(), action => _.includes(_.map(action.target, 'id'), target));
        actionsToDisplay = _.sortBy(actionsToDisplay, [function (o) {
            let found = _.find(o.target, function (t) {
                return t.id === target;
            });

            if (found && found.priority) {
                let priority = Number(found.priority);
                if (!isNaN(priority) && priority !== 0) {
                    return priority;
                }
            }

            // Should be placed at the end if no priority defined, returning 'undefined' is making the ordering bug on FF and Opera
            return 99999;
        }]);

        if (filter) {
            actionsToDisplay = _.filter(actionsToDisplay, filter);
        }

        return _.map(actionsToDisplay, action => <DisplayAction key={action.key} context={context} actionKey={action.key} render={render} observerRef={obs => this.observerRefs.push(obs)}/>);
    }
}

DisplayActions.defaultProps = {
    filter: null
};

DisplayActions.propTypes = {
    target: PropTypes.string.isRequired,
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    filter: PropTypes.func
};

export {DisplayActions};
