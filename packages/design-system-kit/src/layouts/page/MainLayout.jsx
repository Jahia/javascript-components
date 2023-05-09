import PropTypes from 'prop-types';
import React from 'react';
import {Typography, withStyles} from '@material-ui/core';
import {compose} from 'recompose';
import TopBar from '../../components/TopBar';

const styles = theme => ({
    root: {
        flex: '1 1 0%',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: 0
    },
    topBar: {
        color: theme.palette.primary.contrastText
    },
    content: {
        flex: '1 1 0%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
    },
    metaNav: {
        position: 'absolute',
        width: '50%',
        height: theme.spacing.unit * 3,
        top: 0,
        right: 0,
        paddingRight: theme.spacing.unit * 4,
        textAlign: 'right',
        color: theme.palette.text.contrastText + '!important',
        background: 'linear-gradient(to right, rgba(78, 81, 86, 0) 0%, ' + theme.palette.layout.main + ' 100%) !important;',
        '& a': {
            color: 'inherit !important'
        }
    }
});

export const MainLayout = ({classes, topBarProps, help, children}) => (
    <main className={classes.root}>
        {help && (
            <div className={classes.metaNav}>
                <Typography variant='overline' color='inherit'>{help}</Typography>
            </div>
        )}
        <div className={classes.topBar}>
            <TopBar {...topBarProps}/>
        </div>
        <div className={classes.content}>
            {children}
        </div>
    </main>
);

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired,
    topBarProps: PropTypes.object.isRequired,
    help: PropTypes.node
};

MainLayout.defaultProps = {
    help: null
};

export default compose(
    withStyles(styles)
)(MainLayout);
