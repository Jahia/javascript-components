import React, {useEffect, useState} from 'react';
import {storiesOf} from '@storybook/react';
import {DisplayAction} from '../core/DisplayAction';
import {registry} from '../../registry';
import {boolean, number, withKnobs} from '@storybook/addon-knobs';
import PropTypes from 'prop-types';
import {ComponentRendererProvider} from '../../ComponentRenderer';
import {menuAction, MenuActionComponent} from './menuAction';
import {action} from '@storybook/addon-actions';
import markdownNotes from './README.md';
import {ButtonRenderer} from '../samples/ButtonRenderer';

const MenuRenderer = ({isSubMenu, anchor, isOpen, isLoading, onClose, onExited, onMouseEnter, onMouseLeave, children}) => {
    const top = anchor.anchorPosition ? anchor.anchorPosition.top : anchor.anchorEl.getBoundingClientRect().top;
    const left = anchor.anchorPosition ? anchor.anchorPosition.left : anchor.anchorEl.getBoundingClientRect().right;
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
                    pointerEvents: isOpen ? 'auto' : 'none',
                    opacity: isOpen ? 0.4 : 0,
                    transition: 'opacity 1s',
                    backgroundColor: 'black'
                }}
                     onClick={onClose}
                />
            }
            <div style={{
                position: 'fixed',
                top: top,
                left: left,
                border: '1px solid',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: (isOpen && !isLoading) ? 1 : 0,
                transition: 'opacity 1s',
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
    isLoading: PropTypes.bool.isRequired,
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
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func
};

const readyList = [];

const AsyncComponent = ({context, render: Render, loading: Loading}) => {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => {
            readyList.push(context.key);
            setReady(true);
        }, context.minTime);
        return () => {
            clearTimeout(t);
        };
    });
    if (!ready && readyList.indexOf(context.key) === -1) {
        if (context.useLoading && Loading) {
            return <Loading context={context}/>;
        }

        return false;
    }

    return (
        <Render context={{
            ...context,
            label: context.label,
            onClick: () => window.alert('Async action') // eslint-disable-line no-alert
        }}/>
    );
};

AsyncComponent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

function addMenu(key, targets, menuPreload) {
    registry.addOrReplace('action', key, menuAction, {
        label: key,
        targets: targets,
        menuPreload: menuPreload,
        menuTarget: key,
        menuRenderer: MenuRenderer,
        menuItemRenderer: MenuItemRenderer
    });
}

function addItem(key, targets, fn) {
    registry.addOrReplace('action', key, {
        targets: targets,
        label: key,
        onClick: fn
    });
}

function addAsyncItem(key, targets, minTime, useLoading, isVisible) {
    registry.addOrReplace('action', key, {
        targets,
        label: key,
        minTime,
        useLoading,
        isVisible,
        component: AsyncComponent
    });
}

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

        addMenu('menu');
        addItem('item1', ['menu:1'], action('menu item 1'));
        addItem('item2', ['menu:2'], action('menu item 2'));
        addItem('item3', ['menu:3'], action('menu item 3'));

        return (
            <>
                <div className="description">
                    Display all items that have the specified target
                </div>
                <DisplayAction actionKey="menu" context={{path: '/test'}} render={ButtonRenderer}/>
            </>
        );
    })
    .add('Sub menu', () => {
        registry.clear();

        addMenu('menu');
        addMenu('submenu1', ['menu:4']);
        addMenu('submenu2', ['menu:5', 'submenu1:2']);
        addItem('item1', ['menu:1', 'submenu1:1', 'submenu2:1'], action('menu item 1'));
        addItem('item2', ['menu:2'], action('menu item 2'));
        addItem('item3', ['menu:3'], action('menu item 3'));

        return (
            <>
                <div className="description">
                    Displays a menu with items registered with a specific target
                </div>
                <DisplayAction actionKey="menu" context={{path: '/test'}} render={ButtonRenderer}/>
            </>
        );
    })
    .add('Async actions', () => {
        registry.clear();
        readyList.length = 0;

        addMenu('menu');
        addAsyncItem('item1', ['menu'], number('time item1', 0));
        addAsyncItem('item2', ['menu'], number('time item2', 100));
        addAsyncItem('item3', ['menu'], number('time item3', 500));

        return (
            <>
                <div className="description">
                    Example with asynchronous menu items
                </div>
                <DisplayAction actionKey="menu" context={{path: '/test'}} render={ButtonRenderer}/>
            </>
        );
    })
    .add('Async with loading', () => {
        registry.clear();
        readyList.length = 0;

        addMenu('menu');
        addAsyncItem('item1', ['menu'], number('time item1', 0), true);
        addAsyncItem('item2', ['menu'], number('time item2', 100), true);
        addAsyncItem('item3', ['menu'], number('time item3', 500), true);

        return (
            <>
                <div className="description">
                    Example with asynchronous menu items - delayed menu open until loaded
                </div>
                <DisplayAction actionKey="menu"
                               context={{path: '/test'}}
                               render={ButtonRenderer}
                               loading={({context}) => <ButtonRenderer context={{...context, label: 'loading...'}}/>}/>
            </>
        );
    })
    .add('Async loading / preload', () => {
        registry.clear();
        readyList.length = 0;

        addMenu('menu', [], true);
        addAsyncItem('item1', ['menu'], number('time item1', 0), true);
        addAsyncItem('item2', ['menu'], number('time item2', 100), true);
        addAsyncItem('item3', ['menu'], number('time item3', 500), true);

        return (
            <>
                <div className="description">
                    Example with asynchronous menu items - preload
                </div>
                <DisplayAction actionKey="menu"
                               context={{path: '/test', isVisible: true}}
                               render={ButtonRenderer}
                               loading={({context}) => <ButtonRenderer context={{...context, label: 'loading...'}}/>}/>
            </>
        );
    })
    .add('Empty async submenu', () => {
        registry.clear();
        readyList.length = 0;

        addMenu('menu');
        addMenu('submenu1', ['menu:4'], true);
        addMenu('submenu2', ['menu:5', 'submenu1:2'], true);
        addAsyncItem('item1', ['menu:1', 'submenu1:1', 'submenu2:1'], number('time item1', 0), true, boolean('item1 visible', true));
        addAsyncItem('item2', ['menu:2', 'submenu1:2'], number('time item2', 100), true, boolean('item2 visible', true));
        addAsyncItem('item3', ['menu:3'], number('time item3', 500), true, boolean('item3 visible', true));

        return (
            <>
                <div className="description">
                    Example with asynchronous menu items - preload
                </div>
                <DisplayAction actionKey="menu"
                               context={{path: '/test'}}
                               render={ButtonRenderer}
                               loading={({context}) => <ButtonRenderer context={{...context, label: 'loading...'}}/>}/>
            </>
        );
    });

