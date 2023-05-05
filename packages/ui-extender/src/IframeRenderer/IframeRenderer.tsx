import React from 'react';
import PropTypes from 'prop-types';

export type IframeRendererProps = {
    url: string
}

export const IframeRenderer = (props:IframeRendererProps) => {
    // @ts-ignore
    const IframeRendererComp = window?.jahia?.ui?.IframeRenderer;
    if (IframeRendererComp) {
        return <IframeRendererComp {...props}/>;
    }

    return <span>Jahia UI not loaded</span>;
};

export const getIframeRenderer = (url: string) => {
    return <IframeRenderer url={url}/>;
};

IframeRenderer.propTypes = {
    url: PropTypes.string.isRequired
};
