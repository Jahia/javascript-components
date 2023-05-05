import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {ComponentRendererContext} from '~/ComponentRenderer';

type RenderProps = {
    id: string,

    onClick: () => void
}

export type ComponentRendererActionComponentProps = {
    render: React.FunctionComponent<Partial<RenderProps>>,

    componentToRender: React.FunctionComponent,
} & RenderProps;

export const ComponentRendererActionComponent = ({render: Render, componentToRender, ...otherProps}: ComponentRendererActionComponentProps) => {
    const componentRenderer = useContext(ComponentRendererContext);

    const componentContext: {
        id?: string,
        render?: (component: React.FunctionComponent, props?: React.PropsWithChildren<unknown>) => void,
        handleDestroy?: () => void,
        setProperties?: (props: React.PropsWithChildren<unknown>) => void
    } = {};

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
export const componentRendererAction = {
    component: ComponentRendererActionComponent
};

