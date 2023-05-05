import React, {useContext, useEffect, useState} from 'react';
import {ComponentRendererContext} from './ComponentRendererContext';

type StateType = {
    components: {[key:string]: React.FunctionComponent},
    componentsProps: {[key:string]: React.PropsWithChildren<unknown>}
}

export const ComponentRenderer: React.FunctionComponent = () => {
    const [state, setState] = useState<StateType>({components: {}, componentsProps: {}});

    const value = useContext(ComponentRendererContext);

    useEffect(() => {
        value.render = (key, component, props) => setState(previous => {
            const newState = {
                components: {...previous.components},
                componentsProps: {...previous.componentsProps}
            };
            newState.components[key] = component;
            newState.componentsProps[key] = {...props};
            return newState;
        });

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
