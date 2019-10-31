import PropTypes from 'prop-types';
import React from 'react';
import {withStyles, AppBar, Toolbar, Button} from '@material-ui/core';
import {compose} from 'recompose';
import {Typography} from '../Typography';

const styles = theme => ({
    topBar: {
        background: theme.palette.ui.gamma,
        color: theme.palette.invert.beta
    },
    topBarText: {
        fontWeight: 600,
        fontSize: '16px'
    },
    topBarButton: {
        position: 'absolute',
        right: '1.67%',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '18px',
        fontSize: '14px',
        textAlign: 'right',
        color: theme.palette.invert.beta
    }
});

export const ToolBar = ({classes, contextPath, label, title}) => {
    return (
        <AppBar position="static">
            <Toolbar className={classes.topBar}>
                <Typography color="invert" variant="epsilon" className={classes.topBarText}>
                    {title}
                </Typography>
                <Button className={classes.topBarButton}
                        onClick={() => {
                            window.location.href = `${contextPath}/tools`;
                        }}
                >
                    <Typography color="invert" variant="zeta">
                        {label}
                    </Typography>
                </Button>
            </Toolbar>
        </AppBar>
    );
};

ToolBar.defaultProps = {
    contextPath: '',
    label: '',
    title: ''
};

ToolBar.propTypes = {
    classes: PropTypes.object.isRequired,
    contextPath: PropTypes.string,
    label: PropTypes.string,
    title: PropTypes.string
};

export default compose(
    withStyles(styles, {withTheme: true})
)(ToolBar);
