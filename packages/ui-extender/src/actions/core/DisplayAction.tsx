import React from 'react';
import {registry} from '~/registry';
import {StoredService} from '~/registry/service';

let count = 0;

export type DisplayActionProps = {
    /**
     * The key of the action to display
     */
    actionKey: string,
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
        const action: StoredService = registry.get('action', actionKey);

        if (!action) {
            return null;
        }

        if (context) {
            console.warn('Warn : context in DisplayAction is deprecated', actionKey, context);
        }

        const Component = (typeof action.component === 'function') ? action.component : render;

        // Merge props and context. To remove when context is not supported anymore
        const mergedProps = {...context, ...otherProps};

        const componentProps: {[key: string]: unknown, init?: ((ctx: object, props: object) => void)} = {...action, ...mergedProps, originalContext: mergedProps, id: this.id, actionKey};

        if (componentProps.init) {
            componentProps.init(componentProps, this.props);
        }

        const info: { [key: string]: unknown } = {};

        info['data-registry-key'] = action.type + ':' + action.key;

        if (otherProps.target && action.targets) {
            const foundTarget = action.targets.find(t => t.id === otherProps.target);
            if (foundTarget) {
                info['data-registry-target'] = foundTarget.id + ':' + foundTarget.priority;
            }
        }

        // Props are passed as as context and props. Context can be removed when not supported anymore
        return (
            <Component
                key={this.id}
                {...componentProps}
                buttonProps={{
                    ...(componentProps.buttonProps as object),
                    ...info
                }}
                context={componentProps}
                render={this.RenderWrapper}
                loading={loading}
            />
        );
    }
}

export {DisplayAction};
