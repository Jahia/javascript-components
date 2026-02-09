import React from 'react';
import {registry} from '../../registry/registry';
import {DisplayAction} from './DisplayAction';
import {StoredService} from '../../registry/service';
import {ItemLoadingProps, ItemRenderProps} from '../menuAction/menuAction';

export type DisplayActionsProps = Readonly<{
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
    render: React.ComponentType<ItemRenderProps>,
    /**
     * The render component
     */
    loading?: React.ComponentType<ItemLoadingProps>,
    /**
     * Additional filter function
     */
    filter?: (value: StoredService) => boolean,

    [key: string]: unknown
}>

export const DisplayActions = ({target, filter, ...others}: DisplayActionsProps) => {
    const actionsToDisplay: unknown[] = [];
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
