import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {ComponentRendererContext} from '~/ComponentRenderer';

type RenderProps = {
    id: string,

    onClick: () => void
}

type BaseProps = {
    onExited: () => void
}

export type ComponentRendererActionComponentProps<Type extends BaseProps> = {
    render: React.FunctionComponent<Partial<RenderProps>>,

    componentToRender: React.FunctionComponent<Type>,
} & RenderProps;

export const ComponentRendererActionComponent = <Type extends BaseProps, >({render: Render, componentToRender, ...otherProps}: ComponentRendererActionComponentProps<Type>) => {
    const componentRenderer = useContext(ComponentRendererContext);

    const componentContext: {
        id?: string,
        render?: (component: React.FunctionComponent<Type>, props?: React.PropsWithChildren<Type>) => void,
        handleDestroy?: () => void,
        setProperties?: (props: React.PropsWithChildren<Type>) => void
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

