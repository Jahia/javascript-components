import React from 'react';

export const t = jest.fn(key => `translated_${key}`);

export const useTranslation = () => ({
    t,
    i18n: {
        loadNamespaces: jest.fn()
    }
});

export const withTranslation = () => Component => props => <Component {...props} t={key => `translated_${key}`}/>;
