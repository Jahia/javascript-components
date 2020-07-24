import React from 'react';
import PropTypes from 'prop-types';
import {registry} from '../../registry';

let count = 0;

const shallowEquals = (obj1, obj2) =>
    Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every(key => obj1[key] === obj2[key]);

class DisplayAction extends React.Component {
    constructor(props) {
        super(props);
        this.id = props.actionKey + '-' + (count++);
    }

    shouldComponentUpdate(nextProps) {
        return !shallowEquals(nextProps.context, this.props.context);
    }

    render() {
        let {context, actionKey, render, loading, ...otherProps} = this.props;
        let action = registry.get('action', actionKey);

        if (!action) {
            return null;
        }

        const Component = (typeof action.component === 'function') ? action.component : render;

        let componentProps = {...action, ...context, originalContext: context, id: this.id, actionKey, ...otherProps};

        if (componentProps.init) {
            componentProps.init(componentProps, this.props);
        }

        return (
            <Component key={this.id}
                       {...componentProps}
                       {...otherProps}
                       context={componentProps}
                       render={render}
                       loading={loading}
                       actionKey={actionKey}
            />
        );

        // TODO: Get rid of context={componentProps} and displayActionProps: otherProps
    }
}

DisplayAction.propTypes = {
    /**
     * The key of the action to display
     */
    actionKey: PropTypes.string.isRequired,

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
    loading: PropTypes.func
};

export {DisplayAction};
