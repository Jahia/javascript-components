import React, {useContext, useEffect} from 'react';
import {ComponentRendererContext} from '../../ComponentRenderer/ComponentRendererContext';

type RenderProps = {
    id: string,

    onClick: () => void
}

type BaseProps = {
    onExited: () => void
}

export type ComponentRendererActionComponentProps<Type extends BaseProps> = {
    render: React.ComponentType<Partial<RenderProps>>,

    componentToRender: React.ComponentType<Type>,
} & RenderProps;

export const ComponentRendererActionComponent = <Type extends BaseProps, >({render: Render, componentToRender, ...otherProps}: ComponentRendererActionComponentProps<Type>) => {
    const componentRenderer = useContext(ComponentRendererContext);

    const componentContext: {
        id: string,
        render?: (component: React.ComponentType<Type>, props?: React.PropsWithChildren<Type>) => void,
        handleDestroy?: () => void,
        setProperties?: (props: React.PropsWithChildren<Type>) => void
    } = {
        id: 'actionComponent-' + otherProps.id
    };

    useEffect(() => {
        componentContext.id = 'actionComponent-' + otherProps.id;
        componentContext.render = (component, properties) => {
            // @ts-expect-error Why bother with genericity if we add extra props anyway?
            componentRenderer.render?.(componentContext.id, component, {
                ...otherProps,
                onExited: componentContext.handleDestroy,
                ...properties
            });
        };

        componentContext.handleDestroy = () => {
            componentRenderer.destroy?.(componentContext.id);
        };

        componentContext.setProperties = properties => {
            componentRenderer.setProperties?.(componentContext.id, properties);
        };
    });

    if (!otherProps.onClick) {
        return (
            <Render
                // @ts-expect-error TS is right: otherProps supposedly always has onClick defined
                onClick={() => componentContext.render(componentToRender)}
                {...otherProps}
            />
        );
    }

    return <Render {...otherProps}/>;
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

