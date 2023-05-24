import React from 'react';
import {AppBar, Typography, withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        height: '100%',
        width: '100%'
    },
    main: {
        minHeight: 'calc(100% - 30px)',
        width: '100%',
        paddingTop: theme.spacing.unit * 11,
        paddingRight: theme.spacing.unit,
        paddingLeft: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        position: 'relative'
    },
    footer: {
        width: '100%'
    },
    appBar: {
        // Transition: 'all 200ms ease-in-out'
    }
});

class SettingsLayoutCmp extends React.Component {
    render() {
        const {classes, appBar, children, footer, appBarStyle} = this.props;
        return (
            <section className={classes.root}>
                <AppBar position="fixed" classes={{root: classes.appBar}} style={appBarStyle}>
                    {appBar}
                </AppBar>
                <section className={classes.main}>
                    {children}
                </section>
                <footer className={classes.footer}>
                    <Typography gutterBottom align="center" color="textSecondary">
                        {footer}
                    </Typography>
                </footer>
            </section>
        );
    }
}

SettingsLayoutCmp.defaultProps = {
    appBar: null,
    children: null,
    footer: '',
    appBarStyle: {}
};

SettingsLayoutCmp.propTypes = {
    appBar: PropTypes.element,
    children: PropTypes.element,
    footer: PropTypes.string,
    appBarStyle: PropTypes.object,
    classes: PropTypes.object.isRequired
};

export const SettingsLayout = withStyles(styles, {name: 'DxSettingsLayout'})(SettingsLayoutCmp);
