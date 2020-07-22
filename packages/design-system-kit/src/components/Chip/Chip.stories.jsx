import React from 'react';
import {storiesOf} from '@storybook/react';
import {DSProvider} from '../../provider';
import {action} from '@storybook/addon-actions';
import {withKnobs, text} from '@storybook/addon-knobs';
import doc from './Chip.md';
import {Close} from '@material-ui/icons';

import Chip from './Chip';

storiesOf('Chip', module)
    .addDecorator(withKnobs)
    .add(
        'Simple Chip',
        () => (
            <DSProvider>
                <Chip
                    label={text('label', 'Chip au lata')}
                    deleteIcon={<Close/>}
                    onDelete={action('onDelete')}
                />
            </DSProvider>
        ),
        {notes: {markdown: doc}}
    );
