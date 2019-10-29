import PropTypes from 'prop-types';
import React from 'react';
import {div, withStyles} from '@material-ui/core';
import {Typography} from '../Typography';
import {compose} from 'recompose';
import styleConstants from '../../theme/styleConstants';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px ' + (theme.spacing.unit * 3) + 'px',
        height: styleConstants.topBarHeight + 'px'
    },
    typoTitle: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        minWidth: 0
    },
    head: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginRight: 'auto'
    },
    topBarActions: {
        flex: '4 1 0%',
        width: 'min-content',
        minWidth: 'max-content',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    topBarTitle: {
        overflow: 'hidden'
    },
    topBarContext: {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
        '& button': {
            margin: '0px',
            padding: '0px'
        }
    }
});

export const TopBar = ({classes, title, titleProps, contextModifiers, path, actions}) => (
    <div className={classes.root} data-sel-role="top-bar">
        <div className={classes.topBarContext}>
            <div>
                {typeof path === 'string' ? <Typography noWrap gutterBottom variant="omega" color="invert">{path}</Typography> : path}
            </div>

            <div className={classes.topBarTitle}>
                <Typography gutterBottom
                            variant="beta"
                            color="invert"
                            className={classes.typoTitle}
                            data-sel-role="top-bar-title"
                            component="h2"
                            {...titleProps}
                >
                    {title}
                </Typography>
            </div>
            <div>
                {contextModifiers}
            </div>
        </div>
        {actions &&
        <div className={classes.topBarActions}>
            {actions}
        </div>
        }
    </div>
);

TopBar.propTypes = {
    actions: PropTypes.object,
    classes: PropTypes.object.isRequired,
    contextModifiers: PropTypes.node.isRequired,
    path: PropTypes.node,
    title: PropTypes.string.isRequired,
    titleProps: PropTypes.object
};

TopBar.defaultProps = {
    actions: null,
    path: null,
    titleProps: {}
};

export default compose(
    withStyles(styles)
)(TopBar);
