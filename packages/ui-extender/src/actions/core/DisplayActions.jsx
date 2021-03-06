import React from 'react';
import PropTypes from 'prop-types';
import {registry} from '../../registry';
import {DisplayAction} from './DisplayAction';

export const DisplayActions = ({target, filter, ...others}) => {
    let actionsToDisplay = registry.find({type: 'action', target: target});

    if (filter) {
        actionsToDisplay = actionsToDisplay && actionsToDisplay.filter(filter);
    }

    return actionsToDisplay.map(action => <DisplayAction {...others} key={action.key} actionKey={action.key}/>);
};

DisplayActions.defaultProps = {
    filter: null
};

DisplayActions.propTypes = {
    /**
     * The target from which the items will be selected
     */
    target: PropTypes.string.isRequired,

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
