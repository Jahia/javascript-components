import React from 'react';
import {ListItemIcon as MuiListItemIcon, withStyles} from '@material-ui/core';

const styles = theme => ({
    root: {
        marginRight: theme.spacing.unit,
        color: theme.palette.font.alpha,
        flexShrink: 0,
        display: 'inline-flex'
    }
});

const getClasses = ({classes: {root}}) => ({
    root
});

const ListItemIcon = withStyles(styles, {name: 'DsListItemIcon'})(
    ({children, classes, ...props}) => (
        <MuiListItemIcon classes={getClasses({classes})} {...props}>
            {children}
        </MuiListItemIcon>
    )
);

ListItemIcon.propTypes = process.env.NODE_ENV !== 'production' ? {
} : {};

ListItemIcon.displayName = 'DsListItemIcon';

export default ListItemIcon;
