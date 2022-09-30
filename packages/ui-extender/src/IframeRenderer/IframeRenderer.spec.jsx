import React from 'react';
import {shallow} from 'enzyme';
import {getIframeRenderer, IframeRenderer} from './IframeRenderer';

describe('IframeRenderer', () => {
    it('should render', () => {
        const component = shallow(<IframeRenderer url="/goku/cms/adminframe/default/en/sites/toto.linkChecker.html"/>);
        expect(component.html()).toBe('<iframe src="/goku/cms/adminframe/default/en/sites/toto.linkChecker.html" style="display:initial" allowFullscreen="allowFullScreen" width="100%" height="100%"></iframe>');
    });

    it('should render when using function call', () => {
        const component = shallow(getIframeRenderer('/goku/cms/adminframe/default/en/sites/toto.linkChecker.html'));
        expect(component.html()).toBe('<iframe src="/goku/cms/adminframe/default/en/sites/toto.linkChecker.html" style="display:initial" allowFullscreen="allowFullScreen" width="100%" height="100%"></iframe>');
    });
});
