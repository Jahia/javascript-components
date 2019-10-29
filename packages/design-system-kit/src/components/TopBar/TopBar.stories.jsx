import React from 'react';
import {storiesOf} from '@storybook/react';
import {DSProvider} from '../../provider';
import {withKnobs} from '@storybook/addon-knobs';
import TopBar from './TopBar';

storiesOf('TopBar', module)
    .addDecorator(withKnobs)
    .add('default', () => (
        <DSProvider>
            <TopBar
                title="hello"
                titleProps={{
                    component: 'h1'
                }}
                contextModifiers={<div/>}
            />
        </DSProvider>
    ));
