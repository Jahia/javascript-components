import React, {useEffect, useState} from 'react';
import {DisplayAction} from './DisplayAction';
import {registry} from '../../registry';
import {mount} from 'enzyme';
import {ButtonRenderer} from '../samples/ButtonRenderer';
import {LinkRenderer} from '../samples/LinkRenderer';
import PropTypes from 'prop-types';
import {act} from 'react-dom/test-utils';

jest.useFakeTimers();

describe('DisplayAction', () => {
    beforeEach(() => {
        registry.clear();
    });

    it('should call onClick when button is click', () => {
        const action = registry.addOrReplace('action', 'test-action-1', {
            label: 'Simple action',
            onClick: jest.fn()
        });

        const wrapper = mount(<DisplayAction actionKey="test-action-1"
                                             context={{path: '/test1'}}
                                             render={ButtonRenderer}/>);

        expect(action.onClick.mock.calls.length).toBe(0);
        wrapper.find('button').simulate('click');
        expect(action.onClick.mock.calls.length).toBe(1);
    });

    it('should call method with different contexts', () => {
        const fn1 = jest.fn();
        const fn2 = jest.fn();

        registry.addOrReplace('action', 'test-action-1', {
            label: 'test action 1',
            onClick: fn1
        });
        registry.addOrReplace('action', 'test-action-2', {
            label: 'test action 2',
            onClick: fn2
        });
        const wrapper = mount(
            <>
                <DisplayAction actionKey="test-action-1"
                               context={{path: '/test1'}}
                               render={ButtonRenderer}/>
                <DisplayAction actionKey="test-action-2"
                               context={{path: '/test1'}}
                               render={ButtonRenderer}/>
                <DisplayAction actionKey="test-action-1"
                               context={{path: '/test2'}}
                               render={ButtonRenderer}/>
                <DisplayAction actionKey="test-action-2"
                               context={{path: '/test2'}}
                               render={ButtonRenderer}/>
                <DisplayAction actionKey="test-action-1"
                               context={{path: '/test3'}}
                               render={ButtonRenderer}/>
                <DisplayAction actionKey="test-action-2"
                               context={{path: '/test3'}}
                               render={ButtonRenderer}/>
            </>
        );
        wrapper.find('button').forEach(b => b.simulate('click'));
        expect(fn1.mock.calls.length).toBe(3);
        expect(fn1.mock.calls[0][0].path).toBe('/test1');
        expect(fn1.mock.calls[1][0].path).toBe('/test2');
        expect(fn1.mock.calls[2][0].path).toBe('/test3');

        expect(fn2.mock.calls.length).toBe(3);
        expect(fn2.mock.calls[0][0].path).toBe('/test1');
        expect(fn2.mock.calls[1][0].path).toBe('/test2');
        expect(fn2.mock.calls[2][0].path).toBe('/test3');
    });

    it('Renderer', () => {
        registry.addOrReplace('action', 'test-action-1', {
            label: 'test action 1',
            onClick: jest.fn()
        });

        const wrapper = mount(
            <>
                <DisplayAction actionKey="test-action-1"
                               context={{path: '/test'}}
                               render={ButtonRenderer}/>
                <DisplayAction actionKey="test-action-1"
                               context={{path: '/test'}}
                               render={LinkRenderer}/>
            </>
        );

        expect(wrapper.find('button').length).toBe(1);
        expect(wrapper.find('span').length).toBe(1);
    });

    it('should handle composition on onClick', () => {
        const fn1 = jest.fn();
        const fn2 = jest.fn();

        const base = registry.addOrReplace('action', 'base', {
            onClick: fn1,
            arrayExample: ['value1']
        });
        registry.addOrReplace('action', 'compose-1', base, {
            param: '1',
            label: 'compose 1',
            arrayExample: ['value2']
        });
        registry.addOrReplace('action', 'compose-2', base, {
            param: '2',
            label: 'compose 2',
            onClick: fn2
        });

        const wrapper = mount(
            <>
                <DisplayAction actionKey="compose-1"
                               context={{path: '/test1'}}
                               render={ButtonRenderer}/>
                <DisplayAction actionKey="compose-2"
                               context={{path: '/test1'}}
                               render={ButtonRenderer}/>
            </>
        );

        wrapper.find('button').forEach(b => b.simulate('click'));

        expect(fn1.mock.calls.length).toBe(1);
        expect(fn1.mock.calls[0][0].param).toBe('1');

        expect(fn2.mock.calls.length).toBe(1);
        expect(fn2.mock.calls[0][0].param).toBe('2');
        expect(fn2.mock.calls[0][2]).toBe(fn1);
    });

    it('should render component action', () => {
        const fn1 = jest.fn();
        const TestComponent1 = ({context, render: Render}) => (
            <Render context={{
                ...context,
                onClick: fn1
            }}/>
        );

        TestComponent1.propTypes = {
            context: PropTypes.object.isRequired,
            render: PropTypes.func.isRequired
        };

        registry.addOrReplace('action', 'component-1', {
            label: 'component 1',
            component: TestComponent1
        });
        const wrapper = mount(
            <>
                <DisplayAction actionKey="component-1" context={{path: '/test1'}} render={ButtonRenderer}/>
            </>
        );

        wrapper.find('button').simulate('click');
        expect(fn1.mock.calls.length).toBe(1);
        expect(fn1.mock.calls[0][0].path).toBe('/test1');
    });

    it('handle component composition', () => {
        const fn1 = jest.fn();

        const TestComponent1 = ({context, render: Render}) => (
            <Render context={{
                ...context,
                onClick: fn1
            }}/>
        );

        TestComponent1.propTypes = {
            context: PropTypes.object.isRequired,
            render: PropTypes.func.isRequired
        };

        const TestComponent2 = ({context, render}, refOrContext, Previous) => (
            <Previous render={render} context={{...context, extended: true, label: context.label + ' overriden'}}/>
        );

        TestComponent2.propTypes = {
            context: PropTypes.object.isRequired,
            render: PropTypes.func.isRequired
        };

        const base = registry.addOrReplace('action', 'base', {
            component: TestComponent1
        });
        registry.addOrReplace('action', 'component-compose-1', base, {
            param: '1',
            label: 'compose 1'
        });
        registry.addOrReplace('action', 'component-compose-2', base, {
            param: '2',
            label: 'compose 2',
            component: TestComponent2
        });
        const wrapper = mount(
            <>
                <DisplayAction actionKey="component-compose-1" context={{path: '/test1'}} render={ButtonRenderer}/>
                <DisplayAction actionKey="component-compose-2" context={{path: '/test1'}} render={ButtonRenderer}/>
            </>
        );

        wrapper.find('button').forEach(b => b.simulate('click'));
        expect(fn1.mock.calls.length).toBe(2);
        expect(fn1.mock.calls[0][0].path).toBe('/test1');
        expect(fn1.mock.calls[0][0].param).toBe('1');
        expect(fn1.mock.calls[1][0].path).toBe('/test1');
        expect(fn1.mock.calls[1][0].param).toBe('2');
        expect(fn1.mock.calls[1][0].extended).toBe(true);
    });

    it('should update its rendering when using async components', () => {
        const fn1 = jest.fn();

        const AsyncComponent = ({context, render: Render}) => {
            const [value, setValue] = useState(1);
            useEffect(() => {
                const t = setInterval(() => {
                    act(() => setValue(value + 1));
                }, 1000);
                return () => {
                    clearInterval(t);
                };
            });
            return (value > 1) ? (
                <Render context={{
                    ...context,
                    value,
                    label: context.label + value,
                    onClick: fn1
                }}/>
            ) : (
                <span>loading..</span>
            );
        };

        AsyncComponent.propTypes = {
            context: PropTypes.object.isRequired,
            render: PropTypes.func.isRequired
        };

        registry.addOrReplace('action', 'async', {
            label: 'async',
            component: AsyncComponent
        });

        const wrapper = mount(
            <>
                <DisplayAction actionKey="async" context={{path: '/test1'}} render={ButtonRenderer}/>
            </>
        );
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(wrapper.find('button').length).toBe(0);

        jest.advanceTimersByTime(1000);
        wrapper.update();
        expect(wrapper.find('button').length).toBe(1);
        wrapper.find('button').simulate('click');
        expect(fn1.mock.calls.length).toBe(1);
        expect(fn1.mock.calls[0][0].value).toBe(2);
    });

    it('should be able to spawn multiple buttons', () => {
        const fn1 = jest.fn();
        const SpawnActionsComponent = ({context, render: Render}) => {
            return context.names.map(name => (
                <Render key={name}
                        context={{
                            ...context,
                            name,
                            label: context.label + ' ' + name,
                            onClick: fn1
                        }}/>
            ));
        };

        SpawnActionsComponent.propTypes = {
            context: PropTypes.object.isRequired,
            render: PropTypes.func.isRequired
        };

        registry.addOrReplace('action', 'spawn', {
            label: 'child action',
            names: ['child1', 'child2', 'child3'],
            component: SpawnActionsComponent
        });

        const wrapper = mount(
            <DisplayAction actionKey="spawn" context={{path: '/test1'}} render={ButtonRenderer}/>
        );

        wrapper.find('button').forEach(b => b.simulate('click'));
        expect(fn1.mock.calls.length).toBe(3);
        expect(fn1.mock.calls[0][0].path).toBe('/test1');
        expect(fn1.mock.calls[0][0].name).toBe('child1');
        expect(fn1.mock.calls[1][0].name).toBe('child2');
        expect(fn1.mock.calls[2][0].name).toBe('child3');
    });
});
