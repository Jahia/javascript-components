import React from 'react';
import {registry} from '~/registry';
import {StoredService} from "~/registry/service";

let count = 0;

export type DisplayActionProps = {
    /**
     * The key of the action to display
     */
    actionKey: string,
    /**
     * The action context
     */
    context?: Object,
    /**
     * The render component
     */
    render: React.FunctionComponent<object>,
    /**
     * The render component
     */
    loading?: React.FunctionComponent<object>

    [key: string]: unknown
}

const getRenderWrapper = (Render: React.FunctionComponent): React.FunctionComponent => {
    const RenderWrapper = ({context, ...otherProps}: React.PropsWithChildren<{context: object}>) => (
        <Render {...context} {...otherProps}/>
    );

    return RenderWrapper;
};

class DisplayAction extends React.PureComponent<DisplayActionProps> {
    id: string;
    RenderWrapper: React.FunctionComponent;

    constructor(props: DisplayActionProps) {
        super(props);
        this.id = props.actionKey + '-' + (count++);
        this.RenderWrapper = getRenderWrapper(props.render);
    }

    render() {
        const {context, actionKey, render, loading, ...otherProps} = this.props;
        const action: StoredService & { init?: ((ctx: object, props: object) => void)} = registry.get('action', actionKey);

        if (!action) {
            return null;
        }

        if (context) {
            console.warn('Warn : context in DisplayAction is deprecated', actionKey, context);
        }

        const Component = (typeof action.component === 'function') ? action.component : render;

        // Merge props and context. To remove when context is not supported anymore
        const mergedProps = {...context, ...otherProps};

        let componentProps = {...action, ...mergedProps, originalContext: mergedProps, id: this.id, actionKey};

        if (componentProps.init) {
            componentProps.init(componentProps, this.props);
        }

        // Props are passed as as context and props. Context can be removed when not supported anymore
        return (
            <Component key={this.id}
                       {...componentProps}
                       context={componentProps}
                       render={this.RenderWrapper}
                       loading={loading}
            />
        );
    }
}

export {DisplayAction};
