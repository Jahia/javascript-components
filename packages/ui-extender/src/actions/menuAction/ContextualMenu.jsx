import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {DisplayAction} from '../core';

export const ContextualMenu = ({setOpenRef, ...props}) => {
    const onClickRef = useRef();

    const open = (e, newProps) => {
        onClickRef.current({...props, menuUseEventPosition: true, ...newProps, originalContext: {...props, ...newProps}}, e);
        e.preventDefault();
    };

    useEffect(() => {
        setOpenRef.current = open;
    });

    return (
        <DisplayAction {...props}
                       render={({onClick}) => {
                           onClickRef.current = onClick;
                           return false;
                       }}
        />
    );
};

ContextualMenu.propTypes = {
    setOpenRef: PropTypes.object.isRequired,
    loading: PropTypes.func,
    actionKey: PropTypes.string.isRequired
};
