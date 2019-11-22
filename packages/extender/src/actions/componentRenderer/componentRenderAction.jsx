import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {ComponentRendererContext} from '../componentRenderer';

const ComponentRendererActionComponent = ({context, render: Render}) => {
    const componentRenderer = useContext(ComponentRendererContext);

    context.componentRendererContext = context.componentRendererContext || {};
    const ctx = context.componentRendererContext;

    useEffect(() => {
        ctx.id = 'actionComponent-' + context.id;
        ctx.render = (component, properties) => {
            componentRenderer.render(ctx.id, component, {context: context, ...properties});
        };

        ctx.handleDestroy = () => {
            componentRenderer.destroy(ctx.id);
        };

        ctx.setProperties = properties => {
            componentRenderer.setProperties(ctx.id, properties);
        };
    });

    if (!context.onClick) {
        return (
            <Render
                context={{
                    ...context,
                    onClick: () => context.componentRendererContext.render(context.componentRendererContext.componentToRender)
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
