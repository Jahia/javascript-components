import React from 'react';
import PropTypes from 'prop-types';
import {CircularProgress, withStyles} from '@material-ui/core';

const styles = () => ({
    loadingOverlay: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    }
});

class ProgressOverlayCmp extends React.Component {
    render() {
        let {classes} = this.props;
        return <div className={classes.loadingOverlay}><CircularProgress/></div>;
    }
}

ProgressOverlayCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

export const ProgressOverlay = withStyles(styles, {name: 'DxProgressOverlay'})(ProgressOverlayCmp);
