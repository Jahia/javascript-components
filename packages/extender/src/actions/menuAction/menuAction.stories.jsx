import React, {useEffect, useState} from 'react';
import {storiesOf} from '@storybook/react';
import {DisplayAction} from '../core/DisplayAction';
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
                transition: 'opacity 0.2s',
                zIndex: 100
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
        registry.addOrReplace('action', 'default-menu', menuAction, {
            label: 'menu',
            menuTarget: 'default-menu',
            menuRenderer: MenuRenderer,
            menuItemRenderer: MenuItemRenderer
        });
        registry.addOrReplace('action', 'default-menuitem1', {
            targets: ['default-menu'],
            label: 'item1',
            onClick: action('menu item 1')
        });
        registry.addOrReplace('action', 'default-menuitem2', {
            targets: ['default-menu'],
            label: 'item2',
            onClick: action('menu item 2')
        });
        registry.addOrReplace('action', 'default-menuitem3', {
            targets: ['default-menu'],
            label: 'item3',
            onClick: action('menu item 3')
        });

        return (
            <>
                <div className="description">
                    Display all items that have the specified target
                </div>
                <DisplayAction actionKey="default-menu" context={{path: '/test'}} render={ButtonRenderer}/>
            </>
        );
    })
    .add('Sub menu', () => {
        registry.addOrReplace('action', 'submenu-menu', menuAction, {
            label: 'menu',
            menuTarget: 'submenu-menu',
            menuRenderer: MenuRenderer,
            menuItemRenderer: MenuItemRenderer
        });
        registry.addOrReplace('action', 'submenu-menu2', menuAction, {
            targets: ['submenu-menu:4'],
            label: 'submenu 2',
            menuTarget: 'submenu-menu2',
            menuRenderer: MenuRenderer,
            menuItemRenderer: MenuItemRenderer
        });
        registry.addOrReplace('action', 'submenu-menu3', menuAction, {
            targets: ['submenu-menu:5', 'submenu-menu2:2'],
            label: 'submenu 3',
            menuTarget: 'submenu-menu3',
            menuRenderer: MenuRenderer,
            menuItemRenderer: MenuItemRenderer
        });
        registry.addOrReplace('action', 'submenu-menuitem1', {
            targets: ['submenu-menu:1', 'submenu-menu2:1', 'submenu-menu3:1'],
            label: 'item1',
            onClick: action('menu item 1')
        });
        registry.addOrReplace('action', 'submenu-menuitem2', {
            targets: ['submenu-menu:2'],
            label: 'item2',
            onClick: action('menu item 2')
        });
        registry.addOrReplace('action', 'submenu-menuitem3', {
            targets: ['submenu-menu:3'],
            label: 'item3',
            onClick: action('menu item 3')
        });

        return (
            <>
                <div className="description">
                    Displays a menu with items registered with a specific target
                </div>
                <DisplayAction actionKey="submenu-menu" context={{path: '/test'}} render={ButtonRenderer}/>
            </>
        );
    })
    .add('Async actions', () => {
        registry.addOrReplace('action', 'async-menu', menuAction, {
            label: 'menu',
            menuTarget: 'async-menu',
            menuRenderer: MenuRenderer,
            menuItemRenderer: MenuItemRenderer
        });

        const AsyncComponent = ({context, render: Render}) => {
            const [ready, setReady] = useState(false);
            useEffect(() => {
                const t = setTimeout(() => setReady(true), context.minTime);
                return () => {
                    clearTimeout(t);
                };
            });
            return ready && (
                <Render context={{
                    ...context,
                    label: context.label,
                    onClick: () => window.alert('Async action') // eslint-disable-line no-alert
                }}/>
            );
        };

        registry.addOrReplace('action', 'async-item0', {
            targets: ['async-menu:1'],
            label: 'async',
            minTime: 0,
            component: AsyncComponent
        });

        registry.addOrReplace('action', 'async-item1', {
            targets: ['async-menu:2'],
            label: 'async later',
            minTime: 100,
            component: AsyncComponent
        });

        registry.addOrReplace('action', 'async-item2', {
            targets: ['async-menu:3'],
            label: 'async more later',
            minTime: 500,
            component: AsyncComponent
        });

        return (
            <>
                <div className="description">
                    Example with asynchronous menu items
                </div>
                <DisplayAction actionKey="async-menu" context={{path: '/test'}} render={ButtonRenderer}/>
            </>
        );
    });
