import React from 'react';
import PropTypes from 'prop-types';
import {registry} from '../../registry';

let count = 0;

const arrayEquals = (array1, array2) =>
    Array.isArray(array1) && Array.isArray(array2) && array1.length === array2.length && array1.every((value, index) => shallowEquals(value, array2[index]));

const shallowEquals = (obj1, obj2) =>
    Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1)
        .filter(key => (typeof obj1[key] !== 'function') && (typeof obj1[key] !== 'object' || Array.isArray(obj1[key])))
        .every(key => Array.isArray(obj1[key]) ? arrayEquals(obj1[key], obj2[key]) : obj1[key] === obj2[key]);

const wrapRender = render => ({context, ...otherProps}) => {
    const mergedProps = {...context, ...otherProps};
    return render({...mergedProps, context: mergedProps});
};

class DisplayAction extends React.Component {
    constructor(props) {
        super(props);
        this.id = props.actionKey + '-' + (count++);
    }

    shouldComponentUpdate(nextProps) {
        return !shallowEquals(nextProps, this.props);
    }

    render() {
        let {context, actionKey, render: Render, loading, ...otherProps} = this.props;
        let action = registry.get('action', actionKey);

        if (!action) {
            return null;
        }

        // Wrap render to merge context and props, and pass the result for both context and props
        // To remove when context is not supported anymore
        const renderWrapper = wrapRender(Render);

        const Component = (typeof action.component === 'function') ? action.component : renderWrapper;

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
                       render={renderWrapper}
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
