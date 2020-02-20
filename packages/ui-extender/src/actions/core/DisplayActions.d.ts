import * as React from 'react';

export interface DisplayActionsProps {
    /**
     * The target from which the items will be selected
     */
    target: string;
    /**
     * The action context
     */
    context: Object;
    /**
     * The render component
     */
    render: (...args: any[])=>any;
    /**
     * The render component
     */
    loading: (...args: any[])=>any;
    /**
     * Additional filter function
     */
    filter?: (...args: any[])=>any;
}

export class DisplayActions extends React.Component<DisplayActionsProps, any> {
    render(): JSX.Element;

}

