import {parseUrl} from './IframeRenderer.utils';

describe('IframeRenderer Utils', () => {
    it('should replace $site-key in URL', () => {
        let url = '/goku/cms/adminframe/default/sites/$site-key.linkChecker.html';
        url = parseUrl(url, 'toto');
        expect(url).toBe('/goku/cms/adminframe/default/sites/toto.linkChecker.html');
    });

    it('should replace $lang in URL', () => {
        let url = '/goku/cms/adminframe/default/$lang/sites/toto.linkChecker.html';
        url = parseUrl(url, null, 'en');
        expect(url).toBe('/goku/cms/adminframe/default/en/sites/toto.linkChecker.html');
    });

    it('should replace $ui-lang in URL', () => {
        let url = '/goku/cms/adminframe/default/$ui-lang/sites/toto.linkChecker.html';
        url = parseUrl(url, null, null, 'fr');
        expect(url).toBe('/goku/cms/adminframe/default/fr/sites/toto.linkChecker.html');
    });

    it('should replace $site-key and $lang in URL', () => {
        let url = '/goku/cms/adminframe/default/$lang/sites/$site-key.linkChecker.html';
        url = parseUrl(url, 'toto', 'en');
        expect(url).toBe('/goku/cms/adminframe/default/en/sites/toto.linkChecker.html');
    });

    it('should replace $site-key and $ui-lang in URL', () => {
        let url = '/goku/cms/adminframe/default/$ui-lang/sites/$site-key.linkChecker.html';
        url = parseUrl(url, 'toto', null, 'fr');
        expect(url).toBe('/goku/cms/adminframe/default/fr/sites/toto.linkChecker.html');
    });

    it('should replace $lang and $ui-lang in URL', () => {
        let url = '/goku/cms/adminframe/default/$lang/$ui-lang/sites/toto.linkChecker.html';
        url = parseUrl(url, null, 'en', 'fr');
        expect(url).toBe('/goku/cms/adminframe/default/en/fr/sites/toto.linkChecker.html');
    });

    it('should replace $site-key, $lang and $ui-lang in URL', () => {
        let url = '/goku/cms/adminframe/default/$lang/$ui-lang/sites/$site-key.linkChecker.html';
        url = parseUrl(url, 'toto', 'en', 'fr');
        expect(url).toBe('/goku/cms/adminframe/default/en/fr/sites/toto.linkChecker.html');
    });
});
