import React, {useRef} from 'react';
import {ComponentRenderer} from './ComponentRenderer';
import {ComponentRendererContext} from './ComponentRendererContext';

export const ComponentRendererProvider = ({children}: React.PropsWithChildren<object>) => {
    const value = useRef({});

    return (
        <ComponentRendererContext.Provider value={value.current}>
            <ComponentRenderer/>
            {children}
        </ComponentRendererContext.Provider>
    );
};
