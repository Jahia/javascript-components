import React from 'react';
import {Paper as MuiPaper, withStyles} from '@material-ui/core';
import * as _ from 'lodash';
import classnames from 'classnames';

let styles = theme => ({
    root: {
        padding: theme.spacing.unit * 4
    },
    colorLight: {
        backgroundColor: theme.palette.ui.epsilon
    },
    colorDark: {
        backgroundColor: theme.palette.ui.gamma,
        color: theme.palette.invert.beta
    }
});

const getClasses = ({color, classes: {root, ...myClasses}}) => ({
    root: classnames(
        root,
        myClasses['color' + _.capitalize(color)]
    )
});

const Paper = withStyles(styles, {name: 'DsPaper'})(
    ({color, classes, ...props}) => (
        <MuiPaper classes={getClasses({color, classes})} {...props}/>
    )
);

Paper.propTypes = process.env.NODE_ENV !== 'production' ? {
} : {};

Paper.defaultProps = {
    color: 'light'
};

Paper.displayName = 'DsPaper';

export default Paper;
