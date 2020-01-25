import * as React from 'react';

export interface DisplayActionProps {
    /**
     * The key of the action to display
     */
    actionKey: string;
    /**
     * The action context
     */
    context: Object;
    /**
     * The render component
     */
    render: (...args: any[])=>any;
    /**
     * ..
     */
    observerRef?: (...args: any[])=>any;
}

export class DisplayAction extends React.Component<DisplayActionProps, any> {
    render(): JSX.Element;

}

