import React from 'react';
import {storiesOf} from '@storybook/react';
import {DisplayAction} from './DisplayAction';
import {DisplayActions} from './DisplayActions';
import {registry} from '../../registry';
import {action} from '@storybook/addon-actions';
import {text, withKnobs} from '@storybook/addon-knobs';
import PropTypes from 'prop-types';

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
    targets: ['target:3'],
    label: 'test action 3',
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

const ButtonRenderer = ({context}) => (
    <button type="button" onClick={() => context.onClick(context)}>{context.label}</button>
);

ButtonRenderer.propTypes = {
    context: PropTypes.object.isRequired
};

const LinkRenderer = ({context}) => (
    <span style={{backgroundColor: 'yellow'}} onClick={() => context.onClick(context)}>{context.label}</span>
);

LinkRenderer.propTypes = {
    context: PropTypes.object.isRequired
};

storiesOf('DisplayAction', module)
    .addDecorator(withKnobs)
    .add('Simple action', () => (
        <DisplayAction actionKey="test-action-1" context={{path: '/test'}} render={ButtonRenderer}/>
    ))
    .add('Renderer', () => (
        <DisplayAction actionKey="test-action-1" context={{path: '/test'}} render={LinkRenderer}/>
    ));

storiesOf('DisplayActions', module)
    .addDecorator(withKnobs)
    .add('Simple target', () => (
        <DisplayActions target="target"
                        context={{path: '/test'}}
                        render={ButtonRenderer}/>
    ))
    .add('Filtered target', () => (
        <DisplayActions target="target"
                        context={{path: '/test'}}
                        filter={context => context.label.indexOf(text('Filter on label', '')) !== -1}
                        render={ButtonRenderer}/>
    ));
