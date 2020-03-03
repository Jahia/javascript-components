import React from 'react';
import Iframe from 'react-iframe';
import PropTypes from 'prop-types';

export const IframeRenderer = props => (
    <Iframe width="100%"
            height="100%"
            {...props}
            url={props.url}/>
);

export const getIframeRenderer = url => {
    return <IframeRenderer url={url}/>;
};

IframeRenderer.propTypes = {
    url: PropTypes.string.isRequired
};
