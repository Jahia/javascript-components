import React, {useEffect, useState} from 'react';
import {DisplayAction} from './DisplayAction';
import {registry} from '../../registry';
import {mount} from 'enzyme';
import {ButtonRenderer} from '../samples/ButtonRenderer';
import {LinkRenderer} from '../samples/LinkRenderer';
import PropTypes from 'prop-types';
import {act} from 'react-dom/test-utils';

describe('DisplayAction', () => {
    beforeEach(() => {
        registry.clear();
        jest.spyOn(global, 'setInterval');
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should call onClick when button is click', () => {
        const action = registry.addOrReplace('action', 'test-action-1', {
            label: 'Simple action',
            onClick: jest.fn()
        });

        const wrapper = mount(<DisplayAction
            actionKey="test-action-1"
            path="/test1"
            render={ButtonRenderer}/>);

        expect(action.onClick.mock.calls.length).toBe(0);
        wrapper.find('button').simulate('click');
        expect(action.onClick.mock.calls.length).toBe(1);
    });

    it('should call method with different values', () => {
        const fn1 = jest.fn();

        registry.addOrReplace('action', 'test-action-1', {
            label: 'test action 1',
            value: 'test1',
            onClick: fn1
        });
        registry.addOrReplace('action', 'test-action-2', {
            label: 'test action 2',
            value: 'test2',
            onClick: fn1
        });
        const wrapper = mount(
            <>
                <DisplayAction
                    actionKey="test-action-1"
                    path="/test1"
                    render={ButtonRenderer}/>
                <DisplayAction
                    actionKey="test-action-2"
                    path="/test1"
                    render={ButtonRenderer}/>
            </>
        );
        wrapper.find('button').forEach(b => b.simulate('click'));
        expect(fn1.mock.calls.length).toBe(2);
        expect(fn1.mock.calls[0][0].value).toBe('test1');
        expect(fn1.mock.calls[1][0].value).toBe('test2');
    });

    it('should call method with different contexts', () => {
        const fn1 = jest.fn();

        registry.addOrReplace('action', 'test-action-1', {
            label: 'test action 1',
            onClick: fn1
        });
        const wrapper = mount(
            <>
                <DisplayAction
                    actionKey="test-action-1"
                    path="/test1"
                    render={ButtonRenderer}/>
                <DisplayAction
                    actionKey="test-action-1"
                    path="/test2"
                    render={ButtonRenderer}/>
            </>
        );
        wrapper.find('button').forEach(b => b.simulate('click'));
        expect(fn1.mock.calls.length).toBe(2);
        expect(fn1.mock.calls[0][0].path).toBe('/test1');
        expect(fn1.mock.calls[1][0].path).toBe('/test2');
    });

    it('Renderer', () => {
        registry.addOrReplace('action', 'test-action-1', {
            label: 'test action 1',
            onClick: jest.fn()
        });

        const wrapper = mount(
            <>
                <DisplayAction
                    actionKey="test-action-1"
                    path="/test"
                    render={ButtonRenderer}/>
                <DisplayAction
                    actionKey="test-action-1"
                    path="/test"
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
                <DisplayAction
                    actionKey="compose-1"
                    path="/test1"
                    render={ButtonRenderer}/>
                <DisplayAction
                    actionKey="compose-2"
                    path="/test1"
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
        const TestComponent1 = ({render: Render, ...props}) => (
            <Render {...props} onClick={fn1}/>
        );

        TestComponent1.propTypes = {
            render: PropTypes.func.isRequired
        };

        registry.addOrReplace('action', 'component-1', {
            label: 'component 1',
            component: TestComponent1
        });
        const wrapper = mount(
            <DisplayAction actionKey="component-1" path="/test1" render={ButtonRenderer}/>
        );

        wrapper.find('button').simulate('click');
        expect(fn1.mock.calls.length).toBe(1);
        expect(fn1.mock.calls[0][0].path).toBe('/test1');
    });

    it('handle component composition', () => {
        const fn1 = jest.fn();

        const TestComponent1 = ({render: Render, ...props}) => (
            <Render {...props} onClick={fn1}/>
        );

        TestComponent1.propTypes = {
            render: PropTypes.func.isRequired
        };

        const TestComponent2 = ({render, label, ...props}, refOrContext, Previous) => (
            <Previous extended render={render} label={label + ' overriden'} {...props}/>
        );

        TestComponent2.propTypes = {
            label: PropTypes.string.isRequired,
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
                <DisplayAction actionKey="component-compose-1" path="/test1" render={ButtonRenderer}/>
                <DisplayAction actionKey="component-compose-2" path="/test1" render={ButtonRenderer}/>
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

        const AsyncComponent = ({render: Render, label, ...props}) => {
            const [value, setValue] = useState(1);
            useEffect(() => {
                const t = setInterval(() => {
                    act(() => setValue(value + 1));
                }, 1000);
                return () => {
                    clearInterval(t);
                };
            }, [value]);
            return (value > 1) ? (
                <Render
                    label={label + value}
                    value={value}
                    {...props}
                    onClick={fn1}/>
            ) : (
                <span>loading..</span>
            );
        };

        AsyncComponent.propTypes = {
            label: PropTypes.string.isRequired,
            render: PropTypes.func.isRequired
        };

        registry.addOrReplace('action', 'async', {
            label: 'async',
            component: AsyncComponent
        });

        const wrapper = mount(
            <DisplayAction actionKey="async" path="/test1" render={ButtonRenderer}/>
        );
        expect(wrapper.find('button').length).toBe(0);

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();
        expect(wrapper.find('button').length).toBe(1);
        wrapper.find('button').simulate('click');
        expect(fn1.mock.calls.length).toBe(1);
        expect(fn1.mock.calls[0][0].value).toBe(2);
    });

    it('should be able to spawn multiple buttons', () => {
        const fn1 = jest.fn();
        const SpawnActionsComponent = ({render: Render, names, label, ...props}) => names.map(name => (
            <Render
                key={name}
                name={name}
                label={label + ' ' + name}
                {...props}
                onClick={fn1}/>
        ));

        SpawnActionsComponent.propTypes = {
            label: PropTypes.string.isRequired,
            names: PropTypes.arrayOf(PropTypes.string).isRequired,
            render: PropTypes.func.isRequired
        };

        registry.addOrReplace('action', 'spawn', {
            label: 'child action',
            names: ['child1', 'child2', 'child3'],
            component: SpawnActionsComponent
        });

        const wrapper = mount(
            <DisplayAction actionKey="spawn" path="/test1" render={ButtonRenderer}/>
        );

        wrapper.find('button').forEach(b => b.simulate('click'));
        expect(fn1.mock.calls.length).toBe(3);
        expect(fn1.mock.calls[0][0].path).toBe('/test1');
        expect(fn1.mock.calls[0][0].name).toBe('child1');
        expect(fn1.mock.calls[1][0].name).toBe('child2');
        expect(fn1.mock.calls[2][0].name).toBe('child3');
    });
});
