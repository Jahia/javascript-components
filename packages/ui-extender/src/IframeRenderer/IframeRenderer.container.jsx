import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {parseUrl} from './IframeRenderer.utils';
import {IframeRenderer} from './IframeRenderer';
import {Progress} from '@jahia/moonstone-alpha';

export const IframeRendererContainer = props => {
    const {siteKey, uiLang, language} = useSelector(state => ({
        siteKey: state.site,
        uiLang: state.uilang,
        language: state.language
    }));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.waitingMask = message => {
            setLoading(message);
        };

        return () => {
            delete window.waitingMask;
        };
    });

    return (
        <>
            <div style={{flex: 1, display: 'flex', position: 'relative', width: '100%', height: '100%'}}>
                {loading && <Progress/>}
            </div>
            <IframeRenderer width="100%"
                            height="100%"
                            onLoad={() => {
                                if (loading) {
                                    setLoading(false);
                                }
                            }}
                            {...props}
                            url={parseUrl(props.url, siteKey, language, uiLang)}/>
        </>
    );
};

export const getIframeRendererContainer = url => {
    return <IframeRendererContainer url={url}/>;
};

IframeRendererContainer.propTypes = {
    url: PropTypes.string.isRequired
};
