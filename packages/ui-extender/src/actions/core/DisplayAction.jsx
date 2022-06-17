import React from 'react';
import PropTypes from 'prop-types';
import {registry} from '../../registry';

let count = 0;

const getRenderWrapper = Render => {
    const RenderWrapper = ({context, ...otherProps}) => (
        <Render {...context} {...otherProps}/>
    );

    RenderWrapper.propTypes = {
        context: PropTypes.object
    };

    return RenderWrapper;
};

class DisplayAction extends React.PureComponent {
    constructor(props) {
        super(props);
        this.id = props.actionKey + '-' + (count++);
        this.RenderWrapper = getRenderWrapper(props.render);
    }

    render() {
        let {context, actionKey, render, loading, ...otherProps} = this.props;
        let action = registry.get('action', actionKey);

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

DisplayAction.propTypes = {
    /**
     * The key of the action to display
     */
    actionKey: PropTypes.string.isRequired,

    /**
     * The action context, deprecated
     */
    context: PropTypes.object,

    /**
     * The render component
     */
    render: PropTypes.func.isRequired,

    /**
     * The loading component
     */
    loading: PropTypes.func
};

export {DisplayAction};
