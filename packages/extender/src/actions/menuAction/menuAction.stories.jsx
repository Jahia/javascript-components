import React from 'react';
import {storiesOf} from '@storybook/react';
import {DisplayActions} from '../core/DisplayActions';
import {registry} from '../../registry';
import {withKnobs} from '@storybook/addon-knobs';
import PropTypes from 'prop-types';
import {ComponentRendererProvider} from '../../ComponentRenderer';
import {menuAction, MenuActionComponent} from './menuAction';
import {action} from '@storybook/addon-actions';
import markdownNotes from './README.md';
import {ButtonRenderer} from '../samples/ButtonRenderer';

const MenuRenderer = ({isSubMenu, anchor, isOpen, onClose, onExited, onMouseEnter, onMouseLeave, children}) => {
    return (
        <>
            {
                !isSubMenu &&
                <div style={{
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh',
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
                position: 'fixed',
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
    isSubMenu: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    anchor: PropTypes.object.isRequired,
    onExited: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

const MenuItemRenderer = ({context, onClick, onMouseEnter, onMouseLeave}) => {
    return (
        <div style={{margin: 5}} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {context.label}
        </div>
    );
};

MenuItemRenderer.propTypes = {
    context: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
};

storiesOf('actions|menuAction', module)
    .addParameters({
        component: MenuActionComponent,
        componentSubtitle: 'Menu action',
        notes: {markdown: markdownNotes}
    })
    .addDecorator(storyFn => <ComponentRendererProvider>{storyFn()}</ComponentRendererProvider>)
    .addDecorator(withKnobs)
    .add('default', () => {
        registry.clear();

        registry.add('action', 'menu1', menuAction, {
            targets: ['target'],
            label: 'menu 1',
            menuTarget: 'menu1',
            menuRenderer: MenuRenderer,
            menuItemRenderer: MenuItemRenderer
        });
        registry.add('action', 'menu2', menuAction, {
            targets: ['target', 'menu1'],
            label: 'menu 2',
            menuTarget: 'menu2',
            menuRenderer: MenuRenderer,
            menuItemRenderer: MenuItemRenderer
        });
        registry.add('action', 'menu3', menuAction, {
            targets: ['target', 'menu2', 'menu1'],
            label: 'menu 3',
            menuTarget: 'menu3',
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

        return (
            <DisplayActions target="target" context={{path: '/test'}} render={ButtonRenderer}/>
        );
    });
