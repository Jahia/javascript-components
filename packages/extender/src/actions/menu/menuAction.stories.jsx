import React from 'react';
import {storiesOf} from '@storybook/react';
import {DisplayActions} from '../core/DisplayActions';
import {registry} from '../../registry';
import {withKnobs} from '@storybook/addon-knobs';
import PropTypes from 'prop-types';
import {ComponentRendererProvider} from '../componentRenderer';
import {menuAction} from './menuAction';
import {action} from '@storybook/addon-actions';

const MenuRenderer = ({parentMenuContext, anchor, isOpen, onClose, onExited, onMouseEnter, onMouseLeave, children}) => {
    return (
        <>
            {
                !parentMenuContext &&
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    opacity: isOpen ? 0.1 : 0,
                    transition: 'opacity 0.2s',
                    backgroundColor: 'black'
                }}
                     onClick={onClose}
                />
            }
            <div style={{
                position: 'absolute',
                top: anchor.top,
                left: anchor.left,
                border: '1px solid',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isOpen ? 1 : 0,
                transition: 'opacity 0.2s'
            }}
                 onMouseEnter={onMouseEnter}
                 onMouseLeave={onMouseLeave}
                 onTransitionEnd={() => !isOpen && onExited()}
            >
                <div style={{flex: '0 1 auto'}}>
                    {children}
                </div>
            </div>
        </>
    );
};

MenuRenderer.defaultValues = {
    parentMenuContext: null
};

MenuRenderer.propTypes = {
    parentMenuContext: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    anchor: PropTypes.object.isRequired,
    onExited: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

const MenuItemRenderer = ({context}) => {
    return (
        <div style={{margin: 5}}
             onClick={event => {
                 context.onClick(context, event);
             }}
             onMouseEnter={context.onMouseEnter}
             onMouseLeave={context.onMouseLeave}
        >
            {context.label}
        </div>
    );
};

MenuItemRenderer.propTypes = {
    context: PropTypes.object.isRequired
};

const initRegistry = () => {
    registry.clear();

    registry.add('action', 'menu1', menuAction, {
        targets: ['target'],
        label: 'menu 1',
        menu: 'menu1',
        menuRenderer: MenuRenderer,
        menuItemRenderer: MenuItemRenderer
    });
    registry.add('action', 'menu2', menuAction, {
        targets: ['target', 'menu1'],
        label: 'menu 2',
        menu: 'menu2',
        menuRenderer: MenuRenderer,
        menuItemRenderer: MenuItemRenderer
    });
    registry.add('action', 'menu3', menuAction, {
        targets: ['target', 'menu2', 'menu1'],
        label: 'menu 3',
        menu: 'menu3',
        menuRenderer: MenuRenderer,
        menuItemRenderer: MenuItemRenderer
    });
    registry.add('action', 'menuitem1', {
        targets: ['menu1', 'menu2', 'menu3'],
        label: 'item1',
        onClick: action('menu item 1')
    });
    registry.add('action', 'menuitem2', {
        targets: ['menu1'],
        label: 'item2',
        onClick: action('menu item 2')
    });
    registry.add('action', 'menuitem3', {
        targets: ['menu2'],
        label: 'item3',
        onClick: action('menu item 3')
    });
};

const ButtonRenderer = ({context}) => (
    <div>
        <button type="button" onClick={ev => context.onClick(context, ev)}>{context.label}</button>
    </div>
);

ButtonRenderer.propTypes = {
    context: PropTypes.object.isRequired
};

storiesOf('menuAction', module)
    .addDecorator(storyFn => {
        initRegistry();
        return <ComponentRendererProvider>{storyFn()}</ComponentRendererProvider>;
    })
    .addDecorator(withKnobs)
    .add('Menu', () => (
        <DisplayActions target="target" context={{path: '/test'}} render={ButtonRenderer}/>
    ));
