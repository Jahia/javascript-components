import React, {useRef} from 'react';
import {ComponentRenderer} from './ComponentRenderer.tsx';
import {ComponentRendererContext} from './ComponentRendererContext.tsx';

export const ComponentRendererProvider = ({children}: React.PropsWithChildren<object>) => {
    const value = useRef({});

    return (
        <ComponentRendererContext.Provider value={value.current}>
            <ComponentRenderer/>
            {children}
        </ComponentRendererContext.Provider>
    );
};
