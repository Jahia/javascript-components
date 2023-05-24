import React from 'react';
import {storiesOf} from '@storybook/react';
import {DSProvider} from '../../provider';
import {withKnobs, select} from '@storybook/addon-knobs';
import Badge from './Badge';

const variants = [null, 'normal', 'dot', 'circle'];
const colors = [null, 'primary', 'success', 'info', 'ghost', 'warning', 'danger', 'error'];

storiesOf('Badge', module)
    .addDecorator(withKnobs)
    .add('Simple badge', () => (
        <DSProvider>
            <Badge badgeContent="With knobs"
                   variant={select('variant', variants)}
                   color={select('color', colors)}
            />
            <br/>
            <br/>
            <br/>

            <Badge badgeContent="Simple badge"
                   variant="normal"
            />

            <Badge badgeContent="Warning badge"
                   variant="normal"
                   color="warning"
            />
        </DSProvider>
    ));
