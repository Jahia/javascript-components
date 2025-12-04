import React from 'react';
import {DisplayActions} from './DisplayActions';
import {ButtonRenderer} from '../samples/ButtonRenderer';
import {registry} from '../..';
import {mount} from 'enzyme';

describe('DisplayActions', () => {
    beforeEach(() => {
        registry.clear();
    });

    it('should render all actions matching the target', () => {
        const base = {
            onClick: () => window.alert('Action') // eslint-disable-line no-alert
        };
        registry.addOrReplace('action', 'test-action-1', base, {
            targets: ['target-1:1'],
            label: 'test action 1 (filter false)'
        });
        registry.addOrReplace('action', 'test-action-2', base, {
            targets: ['target-1:2'],
            valueToFilter: true,
            label: 'test action 2 (filter true)'
        });
        registry.addOrReplace('action', 'test-action-3', base, {
            targets: ['target-1:3'],
            label: 'test action 3 (filter false)'
        });
        const wrapper = mount(
            <DisplayActions
                target="target-1"
                context={{path: '/test'}}
                render={ButtonRenderer}/>
        );

        expect(wrapper.find('button').length).toBe(3);
    });

    it('should use the otional filter', () => {
        const base = {
            onClick: () => window.alert('Action') // eslint-disable-line no-alert
        };
        registry.addOrReplace('action', 'test-action-1', base, {
            targets: ['target-2:1'],
            label: 'test action 1 (filter false)'
        });
        registry.addOrReplace('action', 'test-action-2', base, {
            targets: ['target-2:2'],
            valueToFilter: true,
            label: 'test action 2 (filter true)'
        });
        registry.addOrReplace('action', 'test-action-3', base, {
            targets: ['target-2:3'],
            label: 'test action 3 (filter false)'
        });
        const wrapper = mount(
            <DisplayActions
                target="target-2"
                context={{path: '/test'}}
                filter={context => context.valueToFilter}
                render={ButtonRenderer}/>
        );

        expect(wrapper.find('button').length).toBe(1);
    });
});
