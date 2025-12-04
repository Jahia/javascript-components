import React, {useContext, useEffect, useState} from 'react';
import {ComponentRendererContext} from './ComponentRendererContext';

type StateType = {
    components: Record<string, React.ComponentType<any>>;
    componentsProps: Record<string, React.PropsWithChildren<any>>;
}

export const ComponentRenderer: React.FunctionComponent = () => {
    const [state, setState] = useState<StateType>({components: {}, componentsProps: {}});

    const value = useContext(ComponentRendererContext);

    useEffect(() => {
        value.render = (key, component, props) => setState(previous => ({
            components: {...previous.components, [key]: component},
            componentsProps: {...previous.componentsProps, [key]: {...props}}
        }));

        value.setProperties = (key, props) => setState(previous => {
            if (previous.components[key]) {
                const newState = {
                    components: {...previous.components},
                    componentsProps: {...previous.componentsProps}
                };

                newState.componentsProps[key] = {...previous.componentsProps[key], ...props};
                return newState;
            }

            return previous;
        });

        value.destroy = key => setState(previous => {
            const newState = {
                components: {...previous.components},
                componentsProps: {...previous.componentsProps}
            };
            delete newState.components[key];
            delete newState.componentsProps[key];
            return newState;
        });
    }, [value]);

    const components = Object.keys(state.components)
        .map(key => {
            const component = state.components[key];
            return React.createElement(component, {key, ...state.componentsProps[key]});
        });

    return (
        <>{components}</>
    );
};
