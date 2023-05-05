import React, {createContext} from 'react';

export type ContextType = {
    render?: <Type, >(key: string, component: React.FunctionComponent<Type>, props?: React.PropsWithChildren<Type>) => void;
    setProperties?: <Type, >(key: string, props: React.PropsWithChildren<Type>) => void;
    destroy?: (key:string) => void;
}

export const ComponentRendererContext = createContext<ContextType>({});

export const ComponentRendererConsumer = ComponentRendererContext.Consumer;

