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
        registry.addOrReplace('action', 'test-action-1', {
            label: 'Simple action',
            onClick: context => window.alert('action 1 on ' + context.path) // eslint-disable-line no-alert
        });

        return (
            <>
                <div className="description">Display a single action</div>
                <div>
                    <DisplayAction actionKey="test-action-1" context={{path: '/test1'}} render={ButtonRenderer}/>
                </div>
            </>
        );
    })
    .add('Simple action', () => {
        registry.addOrReplace('action', 'test-action-1', {
            label: 'test action 1',
            onClick: context => window.alert('action 1 on ' + context.path) // eslint-disable-line no-alert
        });
        registry.addOrReplace('action', 'test-action-2', {
            label: 'test action 2',
            onClick: context => window.alert('action 2 on ' + context.path) // eslint-disable-line no-alert
        });
        return (
            <>
                <div className="description">Display multiple actions with different contexts</div>
                <div>
                    <span style={{margin: '10px'}}>path = /test1</span>
                    <DisplayAction actionKey="test-action-1"
                                   context={{path: '/test1'}}
                                   render={ButtonRenderer}/>
                    <DisplayAction actionKey="test-action-2"
                                   context={{path: '/test1'}}
                                   render={ButtonRenderer}/>
                </div>
                <div>
                    <span style={{margin: '10px'}}>path = /test2</span>
                    <DisplayAction actionKey="test-action-1"
                                   context={{path: '/test2'}}
                                   render={ButtonRenderer}/>
                    <DisplayAction actionKey="test-action-2"
                                   context={{path: '/test2'}}
                                   render={ButtonRenderer}/>
                </div>
                <div>
                    <span style={{margin: '10px'}}>path = /test3</span>
                    <DisplayAction actionKey="test-action-1"
                                   context={{path: '/test3'}}
                                   render={ButtonRenderer}/>
                    <DisplayAction actionKey="test-action-2"
                                   context={{path: '/test3'}}
                                   render={ButtonRenderer}/>
                </div>
            </>
        );
    })
    .add('Renderer', () => {
        registry.addOrReplace('action', 'test-action-1', {
            label: 'test action 1',
            onClick: context => window.alert('action 1 on ' + context.path) // eslint-disable-line no-alert
        });

        return (
            <>
                <div className="description">
                    The same action can be rendered differently, depending on the render property
                </div>
                <div>
                    <span style={{margin: '10px'}}>Button renderer : </span>
                    <DisplayAction actionKey="test-action-1"
                                   context={{path: '/test'}}
                                   render={ButtonRenderer}/>
                </div>
                <div>
                    <span style={{margin: '10px'}}>Link renderer : </span>
                    <DisplayAction actionKey="test-action-1"
                                   context={{path: '/test'}}
                                   render={LinkRenderer}/>
                </div>
            </>
        );
    })
    .add('Composition', () => {
        const base = registry.addOrReplace('action', 'base', {
            onClick: context => window.alert('composed action - label=' + context.param + ', array=' + context.arrayExample), // eslint-disable-line no-alert
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
            onClick: (context, event, superMethod) => window.confirm('composed action - do you want to call overriden action ?') && superMethod(context, event) // eslint-disable-line no-alert
        });

        return (
            <>
                <div className="description">Create a new action by extending an existing action, by adding or replacing information
                    in context. Overriding context is merged with the base one following these rules :
                    <ul>
                        <li>Arrays are concatenated</li>
                        <li>Functions are replaced, but the overriden function is passed as the last argument on call</li>
                        <li>Other attributes are replaced</li>
                    </ul>
                </div>
                <div>
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
    .add('Component action', () => {
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

        registry.addOrReplace('action', 'component-1', {
            label: 'component 1',
            component: TestComponent1
        });
        return (
            <>
                <div className="description">
                    Action rendering is fully handled by a dedicated component, delegating to render for displaying the
                    button
                </div>
                <div>
                    <DisplayAction actionKey="component-1" context={{path: '/test1'}} render={ButtonRenderer}/>
                </div>
            </>
        );
    })
    .add('Component composition', () => {
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

        const TestComponent2 = ({context, render}, refOrContext, Previous) => (
            <Previous render={render} context={{...context, label: context.label + ' overriden'}}/>
        );

        TestComponent2.propTypes = {
            context: PropTypes.object.isRequired,
            render: PropTypes.func.isRequired
        };

        const base = registry.addOrReplace('action', 'base', {
            component: TestComponent1
        });
        registry.addOrReplace('action', 'component-compose-1', base, {
            label: 'compose 1'
        });
        registry.addOrReplace('action', 'component-compose-2', base, {
            label: 'compose 2',
            component: TestComponent2
        });
        return (
            <>
                <div className="description">
                    Component actions can also be composed - the overriden component can still be used as its passed to the render function as last parameter.
                </div>
                <div>
                    <DisplayAction actionKey="component-compose-1" context={{path: '/test1'}} render={ButtonRenderer}/>
                    <DisplayAction actionKey="component-compose-2" context={{path: '/test1'}} render={ButtonRenderer}/>
                </div>
            </>
        );
    })
    .add('Async component action', () => {
        const AsyncComponent = ({context, render: Render}) => {
            const [value, setValue] = useState(1);
            useEffect(() => {
                const t = setInterval(() => setValue(value + 1), 1000);
                return () => {
                    clearInterval(t);
                };
            });
            return (value > 1) ? (
                <Render context={{
                    ...context,
                    label: context.label + value,
                    onClick: () => window.alert('Async action') // eslint-disable-line no-alert
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

        return (
            <>
                <div className="description">
                    An action can render asynchronously and update its context
                </div>
                <div>
                    <DisplayAction actionKey="async" context={{path: '/test1'}} render={ButtonRenderer}/>
                </div>
            </>
        );
    })
    .add('Spawn actions', () => {
        const SpawnActionsComponent = ({context, render: Render}) => {
            return context.names.map(name => (
                <Render key={name}
                        context={{
                            ...context,
                            label: context.label + ' ' + name,
                            onClick: () => window.alert('Spawn action ' + name) // eslint-disable-line no-alert
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

        return (
            <>
                <div className="description">
                    A single action can spawn multiple buttons
                </div>
                <div>
                    <DisplayAction actionKey="spawn" context={{path: '/test1'}} render={ButtonRenderer}/>
                </div>
            </>
        );
    });
