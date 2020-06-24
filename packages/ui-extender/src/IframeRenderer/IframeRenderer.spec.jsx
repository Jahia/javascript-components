import React from 'react';
import {render} from '@testing-library/react';
import {getIframeRenderer, IframeRenderer} from './IframeRenderer';
import '@testing-library/jest-dom';

describe('IframeRenderer', () => {
    it('should render', () => {
        const {container} = render(<IframeRenderer url="/goku/cms/adminframe/default/en/sites/toto.linkChecker.html"/>);
        let actual = container.querySelector('iframe');
        expect(actual).toHaveAttribute('src', '/goku/cms/adminframe/default/en/sites/toto.linkChecker.html');
        expect(actual).toHaveAttribute('style', 'display: block;');
        expect(actual).toHaveAttribute('width', '100%');
        expect(actual).toHaveAttribute('height', '100%');
    });

    it('should render when using function call', () => {
        const {container} = render(getIframeRenderer('/goku/cms/adminframe/default/en/sites/toto.linkChecker.html'));
        let actual = container.querySelector('iframe');
        expect(actual).toHaveAttribute('src', '/goku/cms/adminframe/default/en/sites/toto.linkChecker.html');
        expect(actual).toHaveAttribute('style', 'display: block;');
        expect(actual).toHaveAttribute('width', '100%');
        expect(actual).toHaveAttribute('height', '100%');
    });
});
