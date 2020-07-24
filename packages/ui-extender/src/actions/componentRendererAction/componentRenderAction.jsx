import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {ComponentRendererContext} from '../../ComponentRenderer';

const ComponentRendererActionComponent = ({context, render: Render, ...otherProps}) => {
    const componentRenderer = useContext(ComponentRendererContext);

    context.componentRendererContext = context.componentRendererContext || {};
    const componentRendererContext = context.componentRendererContext;

    useEffect(() => {
        componentRendererContext.id = 'actionComponent-' + context.id;
        componentRendererContext.render = (component, properties) => {
            componentRenderer.render(componentRendererContext.id, component, {context: context, onExited: componentRendererContext.handleDestroy, ...properties});
        };

        componentRendererContext.handleDestroy = () => {
            componentRenderer.destroy(componentRendererContext.id);
        };

        componentRendererContext.setProperties = properties => {
            componentRenderer.setProperties(componentRendererContext.id, properties);
        };
    });

    if (!context.onClick) {
        return (
            <Render
                context={{
                    ...context,
                    onClick: () => context.componentRendererContext.render(context.componentToRender)
                }}
                {...otherProps}
            />
        );
    }

    return <Render context={context} {...otherProps}/>;
};

ComponentRendererActionComponent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
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
