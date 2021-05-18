import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {parseUrl} from './IframeRenderer.utils';
import {IframeRenderer} from './IframeRenderer';

const Progress = ({text}) => (
    <div style={{
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    }}
    >
        <span style={{color: 'white'}}>{text}</span>
    </div>
);

Progress.propTypes = {
    text: PropTypes.string.isRequired
};

export const IframeRendererContainer = props => {
    const {siteKey, uiLang, language} = useSelector(state => ({
        siteKey: state.site,
        uiLang: state.uilang,
        language: state.language
    }));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.waitingMask = message => {
            setLoading(message);
        };

        return () => {
            delete window.waitingMask;
        };
    });

    // Fill known placeholders.
    const placeholders = {};
    placeholders['site-key'] = siteKey;
    placeholders.lang = language;
    placeholders['ui-lang'] = uiLang;

    return (
        <div style={{flex: 1, display: 'flex', position: 'relative'}}>
            {loading && <Progress text={loading}/>}
            <IframeRenderer width="100%"
                            height="100%"
                            onLoad={() => {
                                if (loading) {
                                    setLoading(false);
                                }
                            }}
                            {...props}
                            url={parseUrl(props.url, {...placeholders, ...props.placeholders})}/>
        </div>
    );
};

export const getIframeRendererContainer = url => {
    return <IframeRendererContainer url={url}/>;
};

IframeRendererContainer.defaultProps = {
    placeholders: {}
};

IframeRendererContainer.propTypes = {
    url: PropTypes.string.isRequired,
    placeholders: PropTypes.object
};
