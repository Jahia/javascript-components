import React, {useContext, useEffect, useState} from 'react';
import {ComponentRendererContext} from './ComponentRendererContext';

export const ComponentRenderer = () => {
    const [state, setState] = useState({components: {}, componentsProps: {}});

    let value = useContext(ComponentRendererContext);

    useEffect(() => {
        value.render = (key, component, props) => setState(previous => {
            let newState = {
                components: {...previous.components},
                componentsProps: {...previous.componentsProps}
            };
            newState.components[key] = component;
            newState.componentsProps[key] = {...props};
            return newState;
        });

        value.setProperties = (key, props) => setState(previous => {
            let newState = {
                components: {...previous.components},
                componentsProps: {...previous.componentsProps}
            };
            newState.componentsProps[key] = {...previous.componentsProps[key], ...props};
            return newState;
        });

        value.destroy = key => setState(previous => {
            let newState = {
                components: {...previous.components},
                componentsProps: {...previous.componentsProps}
            };
            delete newState.components[key];
            delete newState.componentsProps[key];
            return newState;
        });
    }, [value]);

    let components = Object.keys(state.components)
        .map(key => {
            const component = state.components[key];
            return React.createElement(component, {key, ...state.componentsProps[key]});
        });

    return components;
};
