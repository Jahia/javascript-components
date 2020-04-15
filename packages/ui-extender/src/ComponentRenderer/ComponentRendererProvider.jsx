import React, {useRef} from 'react';
import {ComponentRenderer} from './ComponentRenderer';
import PropTypes from 'prop-types';
import {ComponentRendererContext} from './ComponentRendererContext';

export const ComponentRendererProvider = ({children}) => {
    const value = useRef({});

    return (
        <ComponentRendererContext.Provider value={value.current}>
            <ComponentRenderer/>
            {children}
        </ComponentRendererContext.Provider>
    );
};

ComponentRendererProvider.defaultProps = {
    children: null
};

ComponentRendererProvider.propTypes = {
    children: PropTypes.element
};

