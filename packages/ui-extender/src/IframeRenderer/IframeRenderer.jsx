import React from 'react';
import PropTypes from 'prop-types';

export const IframeRenderer = props => {
    if (window?.jahia?.ui?.IframeRenderer) {
        // eslint-disable-next-line react/jsx-no-undef
        return <window.jahia.ui.IframeRenderer {...props}/>;
    }

    return 'Jahia UI not loaded';
};

export const getIframeRenderer = url => {
    return <IframeRenderer url={url}/>;
};

IframeRenderer.propTypes = {
    url: PropTypes.string.isRequired
};
