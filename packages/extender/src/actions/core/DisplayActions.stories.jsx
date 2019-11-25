import React from 'react';
import {storiesOf} from '@storybook/react';
import {DisplayActions} from './DisplayActions';
import {text, withKnobs} from '@storybook/addon-knobs';
import markdownNotes from './DisplayActions.md';
import {ButtonRenderer} from '../samples/ButtonRenderer';
import {registry} from '../../registry';

storiesOf('actions|DisplayActions', module)
    .addParameters({
        component: DisplayActions,
        notes: {markdown: markdownNotes}
    })
    .addDecorator(withKnobs)
    .add('default', () => {
        registry.clear();

        const base = {
            onClick: () => window.alert('Action') // eslint-disable-line no-alert
        };
        registry.add('action', 'test-action-1', base, {
            targets: ['target:1'],
            label: 'test action 1 (filter false)'
        });
        registry.add('action', 'test-action-2', base, {
            targets: ['target:2'],
            valueToFilter: true,
            label: 'test action 2 (filter true)'
        });
        registry.add('action', 'test-action-3', base, {
            targets: ['target:3'],
            label: 'test action 3 (filter false)'
        });
        return (
            <DisplayActions target="target"
                            context={{path: text('Path', '/test')}}
                            render={ButtonRenderer}/>
        );
    })
    .add('Filtered target', () => {
        registry.clear();
        const base = {
            onClick: () => window.alert('Action') // eslint-disable-line no-alert
        };
        registry.add('action', 'test-action-1', base, {
            targets: ['target:1'],
            label: 'test action 1 (filter false)'
        });
        registry.add('action', 'test-action-2', base, {
            targets: ['target:2'],
            valueToFilter: true,
            label: 'test action 2 (filter true)'
        });
        registry.add('action', 'test-action-3', base, {
            targets: ['target:3'],
            label: 'test action 3 (filter false)'
        });
        return (
            <DisplayActions target="target"
                            context={{path: text('Path', '/test')}}
                            filter={context => context.valueToFilter}
                            render={ButtonRenderer}/>
        );
    });
