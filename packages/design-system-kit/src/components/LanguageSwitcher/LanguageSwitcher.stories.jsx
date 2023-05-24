import React from 'react';
import {storiesOf} from '@storybook/react';
import LanguageSwitcher from './LanguageSwitcher';
import {DSProvider} from '../../provider';
import {action} from '@storybook/addon-actions';
import {select, withKnobs} from '@storybook/addon-knobs';
import doc from './LanguageSwitcher.md';

const selectFromTwoLanguages = () => select('Start language', ['en', 'fr'], 'en');
const oneAvailableLanguage = () => [{language: 'en', displayName: 'English'}];
const twoAvailableLanguages = () => [{language: 'en', displayName: 'English'}, {language: 'fr', displayName: 'French'}];
const color = () => select('Color', ['default', 'inverted'], LanguageSwitcher.defaultProps.color);

storiesOf('Language switcher', module)
    .addDecorator(withKnobs)
    .add('One language', () => (
        <DSProvider><LanguageSwitcher color={color()} lang="en" languages={oneAvailableLanguage()} onSelectLanguage={action('language-selected')}/></DSProvider>
    ), {notes: {markdown: doc}})
    .add('Two languages', () => (
        <DSProvider><LanguageSwitcher color={color()} lang={selectFromTwoLanguages()} languages={twoAvailableLanguages()} onSelectLanguage={action('language-selected')}/></DSProvider>
    ), {notes: {markdown: doc}});
