import React from 'react';
import {storiesOf} from '@storybook/react';
import {DisplayActions} from '../core/DisplayActions';
import {registry} from '../../registry';
import {withKnobs} from '@storybook/addon-knobs';
import {ComponentRendererProvider} from '../../ComponentRenderer';
import {componentRendererAction, ComponentRendererActionComponent} from './componentRenderAction';
import markdownNotes from './README.md';
import {Modal} from '../samples/Modal';
import {ButtonRenderer} from '../samples/ButtonRenderer';

storiesOf('actions|componentRendererAction', module)
    .addParameters({
        component: ComponentRendererActionComponent,
        notes: {markdown: markdownNotes}
    })
    .addDecorator(storyFn => <ComponentRendererProvider>{storyFn()}</ComponentRendererProvider>)
    .addDecorator(withKnobs)
    .add('Dialog', () => {
        registry.clear();

        const openModalAction = registry.add('action', 'base-component', componentRendererAction, {
            componentToRender: ({context}) => <Modal text={context.content} onClose={context.componentRendererContext.handleDestroy}/> // eslint-disable-line react/prop-types
        });

        registry.add('action', 'renderer1', openModalAction, {
            targets: ['target'],
            label: 'component 1',
            content: 'test 1'
        });
        registry.add('action', 'renderer2', openModalAction, {
            targets: ['target'],
            label: 'component 2',
            content: 'test 2'
        });

        return (
            <DisplayActions target="target" context={{path: '/test'}} render={ButtonRenderer}/>
        );
    });
