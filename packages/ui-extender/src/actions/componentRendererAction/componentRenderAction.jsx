import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {ComponentRendererContext} from '../../ComponentRenderer';

const ComponentRendererActionComponent = ({render: Render, componentToRender, ...otherProps}) => {
    const componentRenderer = useContext(ComponentRendererContext);

    const componentContext = {};

    useEffect(() => {
        componentContext.id = 'actionComponent-' + otherProps.id;
        componentContext.render = (component, properties) => {
            componentRenderer.render(componentContext.id, component, {...otherProps, onExited: componentContext.handleDestroy, ...properties});
        };

        componentContext.handleDestroy = () => {
            componentRenderer.destroy(componentContext.id);
        };

        componentContext.setProperties = properties => {
            componentRenderer.setProperties(componentContext.id, properties);
        };
    });

    if (!otherProps.onClick) {
        return (
            <Render
                onClick={() => componentContext.render(componentToRender)}
                {...otherProps}
            />
        );
    }

    return <Render {...otherProps}/>;
};

ComponentRendererActionComponent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    componentToRender: PropTypes.node
};

/**
 * Context properties :
 *
 * menu : name of the target of actions to display in the menu
 * menuRenderer
 * menuItemRenderer
 */
const componentRendererAction = {
    component: ComponentRendererActionComponent
};

export {componentRendererAction, ComponentRendererActionComponent};
