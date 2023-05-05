import React, {createContext} from 'react';

export type ContextType = {
    render?: (key: string, component: React.FunctionComponent, props?: React.PropsWithChildren<object>) => void;
    setProperties?:(key: string, props: React.PropsWithChildren<object>) => void;
    destroy?: (key:string) => void;
}

export const ComponentRendererContext = createContext<ContextType>({});

export const ComponentRendererConsumer = ComponentRendererContext.Consumer;

