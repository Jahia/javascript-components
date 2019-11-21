import React, {useEffect, useState} from 'react';
import {storiesOf} from '@storybook/react';
import {DisplayAction} from './DisplayAction';
import {DisplayActions} from './DisplayActions';
import {registry} from '../../registry';
import {action} from '@storybook/addon-actions';
import {text, withKnobs} from '@storybook/addon-knobs';
import PropTypes from 'prop-types';

const initRegistry = () => {
    registry.clear();

    registry.add('action', 'test-action-1', {
        targets: ['target:1'],
        label: 'test action 1',
        onClick: action('action-1-click')
    });
    registry.add('action', 'test-action-2', {
        targets: ['target:2'],
        label: 'test action 2',
        onClick: action('action-2-click')
    });
    registry.add('action', 'test-action-3', {
        init: context => {
            context.enabled = (context.path === '/test');
        },
        targets: ['target:3'],
        label: 'test action 3 - enabled only for path=/test',
        onClick: action('action-3-click')
    });
    const base = registry.add('action', 'base', {
        onClick: action('action-click')
    });
    registry.add('action', 'compose-1', base, {
        targets: ['target'],
        label: 'compose 1'
    });
    registry.add('action', 'compose-2', base, {
        targets: ['target'],
        label: 'compose 2'
    });

    const TestComponent1 = ({context, render: Render}) => (
        <Render context={{
            ...context,
            onClick: action('action-component-click')
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

    const TestComponent2 = ({context, render: Render}) => (
        (context.path === '/test') && <Render context={{
            ...context,
            onClick: action('action-component-click')
        }}/>
    );

    TestComponent2.propTypes = {
        context: PropTypes.object.isRequired,
        render: PropTypes.func.isRequired
    };

    registry.add('action', 'component-2', {
        targets: ['target'],
        label: 'component 2 - enabled only for path=/test',
        component: TestComponent2
    });

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
                onClick: action('action-component-click')
            }}/>
        );
    };

    registry.add('action', 'async', {
        targets: ['target'],
        label: 'async',
        component: AsyncComponent
    });
};

const ButtonRenderer = ({context}) => (
    <div>
        <button type="button" onClick={() => context.onClick(context)}>{context.label}</button>
    </div>
);

ButtonRenderer.propTypes = {
    context: PropTypes.object.isRequired
};

const LinkRenderer = ({context}) => (
    <div>
        <span style={{backgroundColor: 'yellow'}} onClick={() => context.onClick(context)}>{context.label}</span>
    </div>
);

LinkRenderer.propTypes = {
    context: PropTypes.object.isRequired
};

storiesOf('DisplayAction', module)
    .addDecorator(storyFn => {
        initRegistry();
        return storyFn();
    })
    .addDecorator(withKnobs)
    .add('Simple action', () => (
        <>
            <div>
                /test1 : <DisplayAction actionKey="test-action-1" context={{path: '/test1'}} render={ButtonRenderer}/><DisplayAction actionKey="test-action-2" context={{path: '/test1'}} render={ButtonRenderer}/>
            </div>
            <div>
                /test2 : <DisplayAction actionKey="test-action-1" context={{path: '/test2'}} render={ButtonRenderer}/><DisplayAction actionKey="test-action-2" context={{path: '/test1'}} render={ButtonRenderer}/>
            </div>
            <div>
                /test3 : <DisplayAction actionKey="test-action-1" context={{path: '/test3'}} render={ButtonRenderer}/><DisplayAction actionKey="test-action-2" context={{path: '/test1'}} render={ButtonRenderer}/>
            </div>
        </>
    ))
    .add('Renderer', () => (
        <DisplayAction actionKey="test-action-1" context={{path: '/test'}} render={LinkRenderer}/>
    ));

storiesOf('DisplayActions', module)
    .addDecorator(storyFn => {
        initRegistry();
        return storyFn();
    })
    .addDecorator(withKnobs)
    .add('Simple target', () => (
        <DisplayActions target="target"
                        context={{path: text('Path', '/test')}}
                        render={ButtonRenderer}/>
    ))
    .add('Filtered target', () => (
        <DisplayActions target="target"
                        context={{path: text('Path', '/test')}}
                        filter={context => context.label.indexOf(text('Filter on label', '')) !== -1}
                        render={ButtonRenderer}/>
    ));
