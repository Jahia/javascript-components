import * as React from 'react';

export interface ComponentRendererProviderProps {
    children?: React.ReactElement<any>;
}

export class ComponentRendererProvider extends React.Component<ComponentRendererProviderProps, any> {
    render(): JSX.Element;

}

export interface ComponentRendererConsumerProps {
}

export class ComponentRendererConsumer extends React.Component<ComponentRendererConsumerProps, any> {
    render(): JSX.Element;

}

