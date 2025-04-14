import React from 'react';
import {DisplayAction} from '../core';
import {MenuProps} from '~/actions';

export type ContextualMenuProps = {
    setOpenRef: React.MutableRefObject<(e: Event, newProps: MenuProps) => void>,
    loading?: React.FunctionComponent<object>,
    actionKey: string
};

export class ContextualMenu extends React.Component<ContextualMenuProps> {
    onClickRef: React.MutableRefObject<(p: MenuProps, e: Event) => void>;

    constructor(props: ContextualMenuProps) {
        super(props);
        this.onClickRef = React.createRef();
    }

    open(e: Event, newProps: MenuProps) {
        this.onClickRef.current({...this.props, isMenuUseEventPosition: true, ...newProps, originalContext: {...this.props, ...newProps}}, e);
        e.preventDefault();
    }

    render() {
        const {setOpenRef} = this.props;
        if (setOpenRef) {
            setOpenRef.current = this.open.bind(this);
        }

        return (
            <DisplayAction
                {...this.props}
                render={props => {
                    const {onClick} = props;
                    this.onClickRef.current = onClick;
                    return null;
                }}
            />
        );
    }
}
