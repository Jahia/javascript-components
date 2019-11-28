import React, {useEffect, useState} from 'react';
import {DisplayAction} from '../core/DisplayAction';
import {registry} from '../../registry';
import PropTypes from 'prop-types';
import {menuAction} from './menuAction';
import {ButtonRenderer} from '../samples/ButtonRenderer';
import {mount} from 'enzyme';
import {ComponentRendererProvider} from '../../ComponentRenderer';
import {act} from 'react-dom/test-utils';

jest.useFakeTimers();

const MenuRenderer = ({isSubMenu, isOpen, onClose, onExited, onMouseEnter, onMouseLeave, children}) => {
    // Simulate close animation, calls onExited after isOpen is set to false
    const [previousOpen, setPreviousOpen] = useState(false);
    if (previousOpen !== isOpen) {
        setTimeout(() => {
            act(() => {
                if (isOpen) {
                    setPreviousOpen(isOpen);
                } else {
                    onExited();
                }
            });
        }, 0);
    }

    return (
        <>
            {!isSubMenu && <div className="backdrop" onClick={onClose}/>}
            <div className="menu"
                 onMouseEnter={onMouseEnter}
                 onMouseLeave={onMouseLeave}
            >
                <div className="menuItems">
                    {children}
                </div>
            </div>
        </>
    );
};

MenuRenderer.propTypes = {
    isSubMenu: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onExited: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

const MenuItemRenderer = ({context, onClick, onMouseEnter, onMouseLeave}) => {
    return (
        <div className="menuItem" onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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

function getSimpleMenu(fn) {
    registry.addOrReplace('action', 'default-menu', menuAction, {
        label: 'menu',
        menuTarget: 'default-menu',
        menuRenderer: MenuRenderer,
        menuItemRenderer: MenuItemRenderer
    });
    registry.addOrReplace('action', 'default-menuitem1', {
        targets: ['default-menu'],
        label: 'item1',
        onClick: fn
    });
    registry.addOrReplace('action', 'default-menuitem2', {
        targets: ['default-menu'],
        label: 'item2',
        onClick: fn
    });
    registry.addOrReplace('action', 'default-menuitem3', {
        targets: ['default-menu'],
        label: 'item3',
        onClick: fn
    });

    return mount(
        <ComponentRendererProvider>
            <DisplayAction actionKey="default-menu" context={{path: '/test'}} render={ButtonRenderer}/>
        </ComponentRendererProvider>
    );
}

function getMenuWithSubMenu(fn) {
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
        onClick: fn
    });
    registry.addOrReplace('action', 'submenu-menuitem2', {
        targets: ['submenu-menu:2'],
        label: 'item2',
        onClick: fn
    });
    registry.addOrReplace('action', 'submenu-menuitem3', {
        targets: ['submenu-menu:3'],
        label: 'item3',
        onClick: fn
    });

    return mount(
        <ComponentRendererProvider>
            <DisplayAction actionKey="submenu-menu" context={{path: '/test'}} render={ButtonRenderer}/>
        </ComponentRendererProvider>
    );
}

function advanceTime(wrapper) {
    jest.advanceTimersByTime(100);
    wrapper.update();
}

describe('DisplayActions', () => {
    beforeEach(() => {
        registry.clear();
    });

    it('should open menu on click', () => {
        const wrapper = getSimpleMenu(jest.fn());
        expect(wrapper.find('.menu').length).toBe(0);
        wrapper.find('button').simulate('click');

        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(1);
        expect(wrapper.find('.menu .menuItem').length).toBe(3);
    });

    it('should close when clicking on backdrop', () => {
        const wrapper = getSimpleMenu(jest.fn());
        wrapper.find('button').simulate('click');

        advanceTime(wrapper);

        expect(wrapper.find('.backdrop').length).toBe(1);
        wrapper.find('.backdrop').simulate('click');

        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(0);
    });

    it('should call method and close when clicking on an item', () => {
        const fn = jest.fn();
        const wrapper = getSimpleMenu(fn);
        wrapper.find('button').simulate('click');

        advanceTime(wrapper);

        wrapper.find('.menuItem').first().simulate('click');

        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(0);
        expect(fn.mock.calls.length).toBe(1);
        expect(fn.mock.calls[0][0].label).toBe('item1');
    });

    it('should open sub menu on hover and close all on click item', () => {
        const fn = jest.fn();
        const wrapper = getMenuWithSubMenu(fn);

        // Open main menu
        wrapper.find('button').simulate('click');
        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(1);
        expect(wrapper.find('.menu .menuItem').length).toBe(5);

        // Hover 5th item (submenu-3)
        wrapper.find('.menu .menuItem').at(4).simulate('mouseenter');
        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(2);
        expect(wrapper.find('.menu .menuItem').length).toBe(6);

        // Hover 4th item (submenu-2), previous sub-menu should be closed
        wrapper.find('.menu .menuItem').at(3).simulate('mouseenter');
        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(2);
        expect(wrapper.find('.menu .menuItem').length).toBe(7);

        // Hover sub-sub-menu item
        const subMenu = wrapper.find('.menu').at(1);
        subMenu.find('.menuItem').at(1).simulate('mouseenter');
        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(3);
        expect(wrapper.find('.menu .menuItem').length).toBe(8);

        // Click item in sub-sub-menu
        wrapper.find('.menu .menuItem').last().simulate('click');
        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(0);
        expect(fn.mock.calls.length).toBe(1);
        expect(fn.mock.calls[0][0].label).toBe('item1');
    });

    it('should update when using asynchronouns items', () => {
        registry.addOrReplace('action', 'async-menu', menuAction, {
            label: 'menu',
            menuTarget: 'async-menu',
            menuRenderer: MenuRenderer,
            menuItemRenderer: MenuItemRenderer
        });

        const AsyncComponent = ({context, render: Render}) => {
            const [ready, setReady] = useState(false);
            useEffect(() => {
                const t = setTimeout(() => act(() => setReady(true)), context.minTime);
                return () => {
                    clearTimeout(t);
                };
            });
            return ready && (
                <Render context={{
                    ...context,
                    label: context.label,
                    onClick: jest.fn()
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
            minTime: 200,
            component: AsyncComponent
        });

        registry.addOrReplace('action', 'async-item2', {
            targets: ['async-menu:3'],
            label: 'async more later',
            minTime: 300,
            component: AsyncComponent
        });

        const wrapper = mount(
            <ComponentRendererProvider>
                <DisplayAction actionKey="async-menu" context={{path: '/test'}} render={ButtonRenderer}/>
            </ComponentRendererProvider>
        );

        wrapper.find('button').simulate('click');
        advanceTime(wrapper);
        expect(wrapper.find('.menu .menuItem').length).toBe(1);

        advanceTime(wrapper);
        expect(wrapper.find('.menu .menuItem').length).toBe(2);

        advanceTime(wrapper);
        expect(wrapper.find('.menu .menuItem').length).toBe(3);
    });
});
