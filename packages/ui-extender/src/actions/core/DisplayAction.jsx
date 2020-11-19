import React from 'react';
import PropTypes from 'prop-types';
import {registry} from '../../registry';

let count = 0;

class DisplayAction extends React.Component {
    constructor(props) {
        super(props);
        this.id = props.actionKey + '-' + (count++);
    }

    render() {
        let {actionKey, render, loading, ...otherProps} = this.props;
        let action = registry.get('action', actionKey);

        if (!action) {
            return null;
        }

        const Component = (typeof action.component === 'function') ? action.component : render;

        let componentProps = {...action, ...otherProps, originalContext: otherProps, id: this.id, actionKey};

        if (componentProps.init) {
            componentProps.init(componentProps, this.props);
        }

        return (
            <Component key={this.id}
                       {...componentProps}
                       render={render}
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
     * The render component
     */
    render: PropTypes.func.isRequired,

    /**
     * The loading component
     */
    loading: PropTypes.func
};

export {DisplayAction};
