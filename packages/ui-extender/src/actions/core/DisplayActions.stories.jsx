import React from 'react';
import {storiesOf} from '@storybook/react';
import {DisplayActions} from './DisplayActions';
import {withKnobs} from '@storybook/addon-knobs';
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
        return (
            <>
                <div className='description'>
                    Display all items that have the specified target
                </div>
                <DisplayActions
                    target='target-1'
                    context={{path: '/test'}}
                    render={ButtonRenderer}/>
            </>
        );
    })
    .add('Filtered target', () => {
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
        return (
            <>
                <div className='description'>
                    The target items can be filtered by a filtering function
                </div>
                <DisplayActions
                    target='target-2'
                    context={{path: '/test'}}
                    filter={context => context.valueToFilter}
                    render={ButtonRenderer}/>
            </>
        );
    });
