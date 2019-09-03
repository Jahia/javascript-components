import React from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, boolean} from '@storybook/addon-knobs';

import {Toggle} from './Toggle';
import doc from './Toggle.md';
import {DSProvider} from '../../provider';

import {action} from '@storybook/addon-actions';

storiesOf('Toggle', module)
    .addDecorator(withKnobs)
    .add(
        'default',
        () => (
            <DSProvider>
                <Toggle
                  checked={boolean('checked', null)}
                  disabled={boolean('disabled', false)}
                  readOnly={boolean('readOnly', false)}
                  onBlur={action('onBlur')}
                  onChange={action('onChange')}
                  onFocus={action('onFocus')}
                />
            </DSProvider>
        ),
        {notes: {markdown: doc}}
    );
