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
        const {target, context, render, loading, filter} = this.props;

        let actionsToDisplay = registry.find({type: 'action', target: target});

        if (filter) {
            actionsToDisplay = _.filter(actionsToDisplay, filter);
        }

        return actionsToDisplay.map(action => <DisplayAction key={action.key} context={context} actionKey={action.key} render={render} loading={loading} observerRef={obs => this.observerRefs.push(obs)}/>);
    }
}

DisplayActions.defaultProps = {
    filter: null
};

DisplayActions.propTypes = {
    /**
     * The target from which the items will be selected
     */
    target: PropTypes.string.isRequired,

    /**
     * The action context
     */
    context: PropTypes.object.isRequired,

    /**
     * The render component
     */
    render: PropTypes.func.isRequired,

    /**
     * The loading component
     */
    loading: PropTypes.func,

    /**
     * Additional filter function
     */
    filter: PropTypes.func
};

export {DisplayActions};
