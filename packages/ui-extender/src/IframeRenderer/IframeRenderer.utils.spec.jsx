import {parseUrl} from './IframeRenderer.utils';

describe('IframeRenderer Utils', () => {
    it('should replace $site-key in URL', () => {
        let placeholders = {};
        placeholders['site-key'] = 'toto';
        let url = '/goku/cms/adminframe/default/sites/$site-key.linkChecker.html';
        url = parseUrl(url, placeholders);
        expect(url).toBe('/goku/cms/adminframe/default/sites/toto.linkChecker.html');
    });

    it('should replace $lang in URL', () => {
        let url = '/goku/cms/adminframe/default/$lang/sites/toto.linkChecker.html';
        url = parseUrl(url, {lang: 'en'});
        expect(url).toBe('/goku/cms/adminframe/default/en/sites/toto.linkChecker.html');
    });

    it('should replace  in URL', () => {
        let placeholders = {};
        placeholders['ui-lang'] = 'fr';
        let url = '/goku/cms/adminframe/default/$ui-lang/sites/toto.linkChecker.html';
        url = parseUrl(url, placeholders);
        expect(url).toBe('/goku/cms/adminframe/default/fr/sites/toto.linkChecker.html');
    });

    it('should replace several placeholders $site-key, $lang and $ui-lang in URL', () => {
        let placeholders = {};
        placeholders['ui-lang'] = 'fr';
        placeholders.lang = 'en';
        placeholders['site-key'] = 'toto';
        let url = '/goku/cms/adminframe/default/$lang/$ui-lang/sites/$site-key.linkChecker.html';
        url = parseUrl(url, placeholders);
        expect(url).toBe('/goku/cms/adminframe/default/en/fr/sites/toto.linkChecker.html');
    });

    it('should replace several occurences $site-key, $lang and $ui-lang in URL', () => {
        let placeholders = {};
        placeholders['ui-lang'] = 'fr';
        placeholders.lang = 'en';
        placeholders['site-key'] = 'toto';
        let url = '/goku/cms/adminframe/default/$lang/$ui-lang/sites/$site-key.linkChecker.$lang.html';
        url = parseUrl(url, placeholders);
        expect(url).toBe('/goku/cms/adminframe/default/en/fr/sites/toto.linkChecker.en.html');
    });
});
