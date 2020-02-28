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

const MenuRenderer = ({isSubMenu, isOpen, isLoading, onClose, onExited, onMouseEnter, onMouseLeave, children}) => {
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
            <div className={isOpen && !isLoading ? 'menu' : 'xxxx'}
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
    isLoading: PropTypes.bool.isRequired,
    onExited: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

const MenuItemRenderer = ({context, onClick, onMouseEnter, onMouseLeave}) => (
    <div className="menuItem" onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {context.label}
    </div>
);

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
            onClick: jest.fn
        }}/>
    );
};

AsyncComponent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired
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

function advanceTime(wrapper) {
    act(() => {
        jest.advanceTimersByTime(100);
        wrapper.update();
    });
}

function getWrapper() {
    return mount(
        <ComponentRendererProvider>
            <DisplayAction actionKey="menu" context={{path: '/test'}} render={ButtonRenderer}/>
        </ComponentRendererProvider>
    );
}

describe('Menu', () => {
    beforeEach(() => {
        registry.clear();
        readyList.length = 0;
    });

    it('should open menu on click', () => {
        const fn = jest.fn();

        addMenu('menu', []);
        addItem('item1', ['menu'], fn);
        addItem('item2', ['menu'], fn);
        addItem('item3', ['menu'], fn);

        const wrapper = getWrapper();

        expect(wrapper.find('.menu').length).toBe(0);
        wrapper.find('button').simulate('click');

        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(1);
        expect(wrapper.find('.menu .menuItem').length).toBe(3);
    });

    it('should close when clicking on backdrop', () => {
        const fn = jest.fn();

        addMenu('menu', []);
        addItem('item1', ['menu'], fn);
        addItem('item2', ['menu'], fn);
        addItem('item3', ['menu'], fn);

        const wrapper = getWrapper();

        wrapper.find('button').simulate('click');

        advanceTime(wrapper);

        expect(wrapper.find('.backdrop').length).toBe(1);
        wrapper.find('.backdrop').simulate('click');

        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(0);
    });

    it('should call method and close when clicking on an item', () => {
        const fn = jest.fn();

        addMenu('menu', []);
        addItem('item1', ['menu'], fn);
        addItem('item2', ['menu'], fn);
        addItem('item3', ['menu'], fn);

        const wrapper = getWrapper();

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

        addMenu('menu', []);
        addMenu('submenu1', ['menu:4']);
        addMenu('submenu2', ['menu:5', 'submenu1:2']);
        addItem('item1', ['menu:1', 'submenu1:1', 'submenu2:1'], fn);
        addItem('item2', ['menu:2'], fn);
        addItem('item3', ['menu:3'], fn);

        const wrapper = getWrapper();

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
        addMenu('menu', []);
        addAsyncItem('async-item1', ['menu'], 0);
        addAsyncItem('async-item2', ['menu'], 200);
        addAsyncItem('async-item3', ['menu'], 300);

        const wrapper = getWrapper();

        wrapper.find('button').simulate('click');
        advanceTime(wrapper);
        expect(wrapper.find('.menu .menuItem').length).toBe(1);

        advanceTime(wrapper);
        expect(wrapper.find('.menu .menuItem').length).toBe(2);

        advanceTime(wrapper);
        expect(wrapper.find('.menu .menuItem').length).toBe(3);
    });

    it('should appear when loaded when using asynchronouns items with loading', () => {
        addMenu('menu', [], false);
        addAsyncItem('async-item1', ['menu'], 0, true);
        addAsyncItem('async-item2', ['menu'], 200, true);
        addAsyncItem('async-item3', ['menu'], 300, true);

        const wrapper = getWrapper();

        wrapper.find('button').simulate('click');
        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(0);

        advanceTime(wrapper);
        expect(wrapper.find('.menu').length).toBe(0);
        //
        advanceTime(wrapper);
        expect(wrapper.find('.menu').length).toBe(1);
        expect(wrapper.find('.menu .menuItem').length).toBe(3);
    });

    it('should preload menu', () => {
        addMenu('menu', [], true);
        addAsyncItem('async-item0', ['menu:1'], 0, true);
        addAsyncItem('async-item1', ['menu:1'], 200, true);
        addAsyncItem('async-item2', ['menu:1'], 300, true);

        const wrapper = getWrapper();

        advanceTime(wrapper);
        advanceTime(wrapper);
        advanceTime(wrapper);

        wrapper.find('button').simulate('click');
        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(1);
        expect(wrapper.find('.menu .menuItem').length).toBe(3);
    });

    it('should not render empty menu', () => {
        addMenu('menu', [], false);
        addMenu('submenu1', ['menu'], true);
        addMenu('submenu2', ['menu'], true);
        addAsyncItem('async-item1', ['menu', 'submenu1', 'submenu2'], 100, true, false);
        addAsyncItem('async-item2', ['menu'], 100, true);
        addAsyncItem('async-item3', ['menu'], 100, true);

        const wrapper = getWrapper();

        wrapper.find('button').simulate('click');
        advanceTime(wrapper);

        expect(wrapper.find('.menu').length).toBe(1);
        expect(wrapper.find('.menu .menuItem').length).toBe(2);
    });
});
