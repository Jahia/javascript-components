import React, {useEffect, useState} from 'react';
import {storiesOf} from '@storybook/react';
import {DisplayAction} from './DisplayAction';
import {registry} from '../../registry';
import {withKnobs} from '@storybook/addon-knobs';
import PropTypes from 'prop-types';
import markdownNotes from './DisplayAction.md';
import {ButtonRenderer} from '../samples/ButtonRenderer';
import {LinkRenderer} from '../samples/LinkRenderer';

storiesOf('actions|DisplayAction', module)
    .addParameters({
        component: DisplayAction,
        notes: {markdown: markdownNotes}
    })
    .addDecorator(withKnobs)
    .add('default', () => {
        registry.clear();

        registry.add('action', 'test-action-1', {
            targets: ['target:1'],
            label: 'test action 1',
            onClick: context => window.alert('action 1 on ' + context.path) // eslint-disable-line no-alert
        });

        return (
            <>
                <div>
                    <DisplayAction actionKey="test-action-1" context={{path: '/test1'}} render={ButtonRenderer}/>
                </div>
            </>
        );
    })
    .add('Simple action', () => {
        registry.clear();

        registry.add('action', 'test-action-1', {
            targets: ['target:1'],
            label: 'test action 1',
            onClick: context => window.alert('action 1 on ' + context.path) // eslint-disable-line no-alert
        });
        registry.add('action', 'test-action-2', {
            targets: ['target:2'],
            label: 'test action 2',
            onClick: context => window.alert('action 2 on ' + context.path) // eslint-disable-line no-alert
        });
        return (
            <>
                <div>
                    <span>path = /test1</span>
                    <DisplayAction actionKey="test-action-1"
                                   context={{path: '/test1'}}
                                   render={ButtonRenderer}/>
                    <DisplayAction actionKey="test-action-2"
                                   context={{path: '/test1'}}
                                   render={ButtonRenderer}/>
                </div>
                <div>
                    <span>path = /test2</span>
                    <DisplayAction actionKey="test-action-1"
                                   context={{path: '/test2'}}
                                   render={ButtonRenderer}/>
                    <DisplayAction actionKey="test-action-2"
                                   context={{path: '/test1'}}
                                   render={ButtonRenderer}/>
                </div>
                <div>
                    <span>path = /test3</span>
                    <DisplayAction actionKey="test-action-1"
                                   context={{path: '/test3'}}
                                   render={ButtonRenderer}/>
                    <DisplayAction actionKey="test-action-2"
                                   context={{path: '/test1'}}
                                   render={ButtonRenderer}/>
                </div>
            </>
        );
    })
    .add('Composition', () => {
        registry.clear();

        const base = registry.add('action', 'base', {
            onClick: context => window.alert('composed action ' + context.param + '  on ' + context.path) // eslint-disable-line no-alert
        });
        registry.add('action', 'compose-1', base, {
            targets: ['target'],
            param: '1',
            label: 'compose 1'
        });
        registry.add('action', 'compose-2', base, {
            targets: ['target'],
            param: '2',
            label: 'compose 2'
        });

        return (
            <>
                <div>
                    <span>path = /test1</span>
                    <DisplayAction actionKey="compose-1"
                                   context={{path: '/test1'}}
                                   render={ButtonRenderer}/>
                    <DisplayAction actionKey="compose-2"
                                   context={{path: '/test1'}}
                                   render={ButtonRenderer}/>
                </div>
            </>
        );
    })
    .add('Renderer', () => {
        registry.clear();

        registry.add('action', 'test-action-1', {
            targets: ['target:1'],
            label: 'test action 1',
            onClick: context => window.alert('action 1 on ' + context.path) // eslint-disable-line no-alert
        });

        return (
            <>
                <div>
                    <span>Button renderer : </span>
                    <DisplayAction actionKey="test-action-1"
                                   context={{path: '/test'}}
                                   render={ButtonRenderer}/>
                </div>
                <div>
                    <span>Link renderer : </span>
                    <DisplayAction actionKey="test-action-1"
                                   context={{path: '/test'}}
                                   render={LinkRenderer}/>
                </div>
            </>
        );
    })
    .add('Component action', () => {
        registry.clear();

        const TestComponent1 = ({context, render: Render}) => (
            <Render context={{
                ...context,
                onClick: () => window.alert('Component action') // eslint-disable-line no-alert
            }}/>
        );

        TestComponent1.propTypes = {
            context: PropTypes.object.isRequired,
            render: PropTypes.func.isRequired
        };

        registry.add('action', 'component-1', {
            targets: ['target'],
            label: 'component 1',
            component: TestComponent1
        });
        return (
            <>
                <div>
                    <DisplayAction actionKey="component-1" context={{path: '/test1'}} render={ButtonRenderer}/>
                </div>
            </>
        );
    })
    .add('Async component action', () => {
        registry.clear();

        const AsyncComponent = ({context, render: Render}) => {
            const [value, setValue] = useState(1);
            useEffect(() => {
                const t = setInterval(() => setValue(value + 1), 1000);
                return () => {
                    clearInterval(t);
                };
            });
            return (value > 2) && (
                <Render context={{
                    ...context,
                    label: context.label + value,
                    onClick: () => window.alert('Async action') // eslint-disable-line no-alert
                }}/>
            );
        };

        registry.add('action', 'async', {
            targets: ['target'],
            label: 'async',
            component: AsyncComponent
        });

        return (
            <>
                <div>
                    <DisplayAction actionKey="async" context={{path: '/test1'}} render={ButtonRenderer}/>
                </div>
            </>
        );
    });
