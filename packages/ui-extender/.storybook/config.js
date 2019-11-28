import {addParameters, configure} from '@storybook/react';
import {DocsContainer, DocsPage} from '@storybook/addon-docs/blocks';

addParameters({
    docs: {
        container: DocsContainer,
        page: DocsPage,
    },
});

configure(require.context('../src', true, /\.stories\.(jsx|mdx)$/), module);
