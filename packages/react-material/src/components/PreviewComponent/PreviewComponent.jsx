import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {getFileType, isBrowserImage, isPDF} from '../../utils';
import {ProgressOverlay} from '../../layout/ProgressOverlay';
import classNames from 'classnames';
import {Paper, withStyles} from '@material-ui/core';
import DocumentViewer from './DocumentViewer';
import PDFViewer from './PDFViewer';
import ImageViewer from './ImageViewer';
import {DxContext} from '../DxContext';
import {compose} from 'recompose';
import {useContentPreview} from '../../../../data-helper';

const styles = theme => ({
    previewContainer: {
        flex: '1 1 0%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 0,
        backgroundColor: theme.palette.background.default
    },
    noPreviewContainer: {
        flex: '1 1 0%',
        backgroundColor: theme.palette.background.default,
        display: 'flex'
    },
    center: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        color: theme.palette.text.disabled
    },
    centerIcon: {
        margin: '8 auto'
    },
    mediaContainer: {
        backgroundColor: theme.palette.background.dark
    },
    contentContainer: {
        padding: (theme.spacing.unit * 3) + 'px'
    },
    contentPaper: {
        width: '100%',
        height: '100%',
        display: 'flex'
    },
    contentIframe: {
        border: 'none',
        width: '100%',
        height: '100%'
    }
});

export const PreviewComponentCmp = ({classes, handleError, t, workspace, fullScreen, domLoadedCallback, iFrameStyle, iframeProps, queryVariables}) => {
    const {data, loading, error, refetch} = useContentPreview(queryVariables);

    useEffect(() => {
        if (!loading && !error) {
            refetch();
        }
    });

    if (loading || Object.keys(data).length === 0) {
        return <ProgressOverlay/>;
    }

    if (error) {
        handleError(error);
    }

    const iframeLoadContent = (assets, displayValue, element, domLoadedCallback, iFrameStyle) => {
        if (element) {
            let frameDoc = element.document;
            if (element.contentWindow) {
                frameDoc = element.contentWindow.document;
            }

            frameDoc.open();
            frameDoc.close();
            frameDoc.body.innerHTML = displayValue;
            frameDoc.body.setAttribute('style', iFrameStyle);

            if (assets !== null) {
                let iframeHeadEl = frameDoc.getElementsByTagName('head')[0];
                if (!iframeHeadEl) {
                    frameDoc.getElementsByTagName('html')[0].insertBefore(frameDoc.createElement('head'), frameDoc.body);
                    iframeHeadEl = frameDoc.getElementsByTagName('head')[0];
                }

                assets.forEach(asset => {
                    let linkEl = document.createElement('link');
                    linkEl.setAttribute('rel', 'stylesheet');
                    linkEl.setAttribute('type', 'text/css');
                    linkEl.setAttribute('href', asset.key);
                    iframeHeadEl.appendChild(linkEl);
                });
            }

            if (domLoadedCallback) {
                domLoadedCallback(frameDoc);
            }
        }
    };

    let result = data.jcr ? data.jcr : {};
    let displayValue = result && result.nodeByPath && result.nodeByPath.renderedContent ? result.nodeByPath.renderedContent.output : '';
    if (displayValue === '') {
        displayValue = t('label.contentManager.contentPreview.noViewAvailable');
    }

    // If node type is "jnt:file" use specific viewer
    if (result && result.nodeByPath && result.nodeByPath.lastModified && result.nodeByPath.isFile) {
        return (
            <DxContext.Consumer>
                {dxContext => {
                    let file = dxContext.contextPath + '/files/' + (workspace === 'edit' ? 'default' : 'live') + result.nodeByPath.path.replace(/[^/]/g, encodeURIComponent) + (result.nodeByPath.lastModified ? ('?lastModified=' + result.nodeByPath.lastModified.value) : '');
                    if (isPDF(result.nodeByPath.path)) {
                        return (
                            <div className={classes.previewContainer} data-sel-role="preview-type-pdf">
                                <PDFViewer file={file} fullScreen={fullScreen}/>
                            </div>
                        );
                    }

                    if (isBrowserImage(result.nodeByPath.path)) {
                        return (
                            <div className={classNames(classes.previewContainer, classes.mediaContainer)}
                                 data-sel-role="preview-type-image"
                            >
                                <ImageViewer file={file} fullScreen={fullScreen}/>
                            </div>
                        );
                    }

                    const type = getFileType(result.nodeByPath.path);
                    const isMedia = (type === 'avi' || type === 'mp4' || type === 'video');
                    return (
                        <div className={classNames(classes.previewContainer, isMedia && classes.mediaContainer)}
                             data-sel-role="preview-type-document"
                        >
                            <DocumentViewer file={file} type={type} fullScreen={fullScreen}/>
                        </div>
                    );
                }}
            </DxContext.Consumer>
        );
    }

    const assets = result && result.nodeByPath && result.nodeByPath.renderedContent ? result.nodeByPath.renderedContent.staticAssets : [];
    return (
        <div className={classNames(classes.previewContainer, classes.contentContainer)}
             data-sel-role="preview-type-content"
        >
            <Paper elevation={1} classes={{root: classes.contentPaper}}>
                <iframe key={result && result.nodeByPath ? result.nodeByPath.path : 'NoPreviewAvailable'}
                        ref={element => iframeLoadContent(assets, displayValue, element, domLoadedCallback, iFrameStyle)}
                        data-sel-role={workspace + '-preview-frame'}
                        className={classes.contentIframe}
                        {...iframeProps}
                />
            </Paper>
        </div>
    );
};

PreviewComponentCmp.defaultProps = {
    fullScreen: false,
    domLoadedCallback: null,
    iFrameStyle: '',
    iframeProps: {}
};

PreviewComponentCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    workspace: PropTypes.string.isRequired,
    // eslint-disable-next-line react/boolean-prop-naming
    fullScreen: PropTypes.bool,
    domLoadedCallback: PropTypes.func,
    iFrameStyle: PropTypes.string,
    iframeProps: PropTypes.object,
    handleError: PropTypes.func.isRequired,
    queryVariables: PropTypes.object.isRequired
};

const PreviewComponent = compose(
    withStyles(styles)
)(PreviewComponentCmp);

export {PreviewComponent};
