export const parseUrl = (url, siteKey, language, uiLang) => {
    return url.replace('$site-key', siteKey)
        .replace('$lang', language)
        .replace('$ui-lang', uiLang);
};
