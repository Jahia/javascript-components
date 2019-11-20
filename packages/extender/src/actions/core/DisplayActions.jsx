import React from 'react';
import PropTypes from 'prop-types';
import {registry} from '../../registry';
import * as _ from 'lodash';
import {DisplayAction} from './DisplayAction';

class DisplayActions extends React.Component {
    constructor(props) {
        super(props);
        this.observerRefs = [];
    }

    render() {
        const {target, context, render, filter} = this.props;

        let actionsToDisplay = registry.find({type: 'action', target: target});

        if (filter) {
            actionsToDisplay = _.filter(actionsToDisplay, filter);
        }

        return actionsToDisplay.map(action => <DisplayAction key={action.key} context={context} actionKey={action.key} render={render} observerRef={obs => this.observerRefs.push(obs)}/>);
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
