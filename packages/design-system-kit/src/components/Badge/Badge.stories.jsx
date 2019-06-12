import React from 'react';
import {storiesOf} from '@storybook/react';
import {DSProvider} from '../../provider';
import {withKnobs} from '@storybook/addon-knobs';
import Badge from './Badge';

storiesOf('Badge', module)
    .addDecorator(withKnobs)
    .add('Simple badge', () => (
        <DSProvider>
            <Badge badgeContent="Simple badge"
                   variant="normal"
            />

            <Badge badgeContent="Warning badge"
                   variant="normal"
                   color="warning"
            />
        </DSProvider>
    ));
