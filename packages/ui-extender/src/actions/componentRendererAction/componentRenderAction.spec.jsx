import React from 'react';
import {DisplayActions} from '../core/DisplayActions';
import {registry, ComponentRendererProvider} from '../..';
import {componentRendererAction} from './componentRenderAction';
import {Modal} from '../samples/Modal';
import {ButtonRenderer} from '../samples/ButtonRenderer';
import {mount} from 'enzyme';

describe('DisplayActions', () => {
    beforeEach(() => {
        registry.clear();
    });

    it('should display component on click', () => {
        const openModalAction = registry.addOrReplace('action', 'base-component', componentRendererAction, {
            componentToRender: Modal
        });

        registry.addOrReplace('action', 'renderer-1', openModalAction, {
            targets: ['target-renderer'],
            label: 'component 1',
            content: 'test 1'
        });
        registry.addOrReplace('action', 'renderer-2', openModalAction, {
            targets: ['target-renderer'],
            label: 'component 2',
            content: 'test 2'
        });

        const wrapper = mount(
            <ComponentRendererProvider>
                <DisplayActions target="target-renderer" context={{path: '/test'}} render={ButtonRenderer}/>
            </ComponentRendererProvider>
        );

        expect(wrapper.find('.modal').length).toBe(0);
        wrapper.find('button').first().simulate('click');
        expect(wrapper.find('.modal').length).toBe(1);
        expect(wrapper.find('.modal div').text()).toBe('test 1');

        wrapper.find('.backdrop').simulate('click');
        expect(wrapper.find('.modal').length).toBe(0);
        wrapper.find('button').last().simulate('click');
        expect(wrapper.find('.modal').length).toBe(1);
        expect(wrapper.find('.modal div').text()).toBe('test 2');
    });
});
