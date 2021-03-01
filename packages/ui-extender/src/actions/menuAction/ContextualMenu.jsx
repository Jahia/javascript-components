import React from 'react';
import PropTypes from 'prop-types';
import {DisplayAction} from '../core';

export class ContextualMenu extends React.Component {
    constructor(props) {
        super(props);
        this.onClickRef = React.createRef();
    }

    open(e, newProps) {
        this.onClickRef.current({...this.props, isMenuUseEventPosition: true, ...newProps, originalContext: {...this.props, ...newProps}}, e);
        e.preventDefault();
    }

    render() {
        const {setOpenRef} = this.props;
        if (setOpenRef) {
            setOpenRef.current = this.open.bind(this);
        }

        return (
            <DisplayAction {...this.props}
                           render={({onClick}) => {
                               this.onClickRef.current = onClick;
                               return false;
                           }}
            />
        );
    }
}

ContextualMenu.propTypes = {
    setOpenRef: PropTypes.object.isRequired,
    loading: PropTypes.func,
    actionKey: PropTypes.string.isRequired
};
