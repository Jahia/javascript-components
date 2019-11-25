import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {ComponentRendererContext} from '../../ComponentRenderer';

const ComponentRendererActionComponent = ({context, render: Render}) => {
    const componentRenderer = useContext(ComponentRendererContext);

    context.componentRendererContext = context.componentRendererContext || {};
    const componentRendererContext = context.componentRendererContext;

    useEffect(() => {
        componentRendererContext.id = 'actionComponent-' + context.id;
        componentRendererContext.render = (component, properties) => {
            componentRenderer.render(componentRendererContext.id, component, {context: context, ...properties});
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
            />
        );
    }

    return <Render context={context}/>;
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
