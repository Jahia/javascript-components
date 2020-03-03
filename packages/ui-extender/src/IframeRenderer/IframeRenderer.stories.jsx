import React from 'react';
import {storiesOf} from '@storybook/react';
import {text, withKnobs} from '@storybook/addon-knobs';
import {IframeRenderer} from './IframeRenderer';

const urlValue = () => text('Url to display', 'https://www.example.com');

storiesOf('actions|menuAction', module)
    .addParameters({
        component: IframeRenderer,
        componentSubtitle: 'Iframe renderer'
    })
    .addDecorator(withKnobs)
    .add('Playground', () => {
        return <IframeRenderer url={urlValue()}/>;
    });
