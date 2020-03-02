import React from 'react';
import PropTypes from 'prop-types';
import {DisplayAction} from '../core';

export class ContextualMenu extends React.Component {
    open(e, context) {
        this.ctx.onClick({...this.ctx, ...context, originalContext: {...this.props.context, ...context}}, e);
        e.preventDefault();
    }

    render() {
        return (
            <DisplayAction actionKey={this.props.actionKey}
                           context={this.props.context}
                           loading={this.props.loading}
                           render={({context}) => {
                               this.ctx = context;
                               return false;
                           }}/>
        );
    }
}

ContextualMenu.propTypes = {
    context: PropTypes.object.isRequired,
    loading: PropTypes.func,
    actionKey: PropTypes.string.isRequired
};
