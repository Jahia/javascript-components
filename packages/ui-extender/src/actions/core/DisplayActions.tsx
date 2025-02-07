import React from 'react';
import PropTypes from 'prop-types';
import {registry} from '~/registry';
import {DisplayAction} from './DisplayAction';
import {StoredService} from '~/registry/service';

export type DisplayActionsProps = {
    /**
     * The target from which the items will be selected
     */
    target: string,
    /**
     * The action context
     */
    context?: object,
    /**
     * The render component
     */
    render: React.FunctionComponent<object>,
    /**
     * The render component
     */
    loading?: React.FunctionComponent<object>,
    /**
     * Additional filter function
     */
    filter?: (value: StoredService) => boolean,

    [key: string]: unknown
}

export const DisplayActions = ({target, filter, ...others}: DisplayActionsProps) => {
    const actionsToDisplay: any[] = [];
    let targets = [];

    if (Array.isArray(target)) {
        targets = target;
    } else {
        targets.push(target);
    }

    targets.forEach(t => {
        const actions = registry.find({type: 'action', target: t})
            .filter(filter ? filter : () => true)
            .map(action => <DisplayAction {...others} key={action.key} target={t} actionKey={action.key}/>);
        actionsToDisplay.push(...actions);
    });

    return <>{actionsToDisplay}</>;
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
