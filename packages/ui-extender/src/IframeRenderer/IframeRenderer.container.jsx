import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {parseUrl} from './IframeRenderer.utils';
import {IframeRenderer} from './IframeRenderer';

export const IframeRendererContainer = props => {
    const {siteKey, uiLang, language} = useSelector(state => ({
        siteKey: state.site,
        uiLang: state.uilang,
        language: state.language
    }));

    return (
        <IframeRenderer width="100%"
                        height="100%"
                        {...props}
                        url={parseUrl(props.url, siteKey, language, uiLang)}/>
    );
};

export const getIframeRendererContainer = url => {
    return <IframeRendererContainer url={url}/>;
};

IframeRendererContainer.propTypes = {
    url: PropTypes.string.isRequired
};
