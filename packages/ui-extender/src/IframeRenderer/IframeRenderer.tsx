import React from 'react';
import PropTypes from 'prop-types';

declare global {
    interface Window {
        jahia: { ui: { IframeRenderer: React.FunctionComponent<IframeRendererProps> } };
    }
}

export type IframeRendererProps = {
    url: string
}

export const IframeRenderer = (props:IframeRendererProps) => {
    const IframeRendererComp = window?.jahia?.ui?.IframeRenderer;
    if (IframeRendererComp) {
        return <IframeRendererComp {...props}/>;
    }

    return <span>Jahia UI not loaded</span>;
};

export const getIframeRenderer = (url: string) => <IframeRenderer url={url}/>;

IframeRenderer.propTypes = {
    url: PropTypes.string.isRequired
};
