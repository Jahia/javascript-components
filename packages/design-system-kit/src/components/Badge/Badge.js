import React from 'react';
import {Badge as MuiBadge, withStyles} from '@material-ui/core';
import * as _ from 'lodash';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.moonstone.neutral.grayLight40,
        color: theme.palette.moonstone.accent.dark,
        margin: '0 ' + theme.spacing.unit + 'px',
        '& svg': {
            width: 14,
            float: 'left'
        }
    },
    normal: {
        height: theme.spacing.unit * 2.25,
        minWidth: theme.spacing.unit * 2.25,
        borderRadius: theme.spacing.unit,
        padding: `0 ${theme.spacing.unit / 2}px`
    },
    dot: {
        height: theme.spacing.unit,
        minWidth: theme.spacing.unit,
        borderRadius: '50%',
        '& > span': {
            display: 'none'
        }
    },
    circle: {
        height: theme.spacing.unit * 2.25,
        minWidth: theme.spacing.unit * 2.25,
        borderRadius: '50%'
    },
    positionInline: {
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 'normal'
    },
    positionRelative: {},
    colorSuccess: {
        backgroundColor: theme.palette.moonstone.support.success40,
        color: theme.palette.moonstone.neutral.grayDark
    },
    colorInfo: {
        backgroundColor: theme.palette.moonstone.accent.light40,
        color: theme.palette.moonstone.accent.darkContrast
    },
    colorGhost: {
        backgroundColor: theme.palette.ui.alpha,
        color: theme.palette.font.beta
    },
    colorWarning: {
        backgroundColor: theme.palette.moonstone.support.warning40,
        color: theme.palette.moonstone.neutral.grayDark
    },
    colorDanger: {
        backgroundColor: theme.palette.moonstone.support.danger40,
        color: theme.palette.moonstone.neutral.grayDark
    },
    colorError: {
        backgroundColor: theme.palette.support.epsilon,
        color: theme.palette.support.alpha
    },
    badge: {
        position: 'static',
        transform: 'none',
        fontSize: theme.spacing.unit * 1.5,
        fontWeight: 600
    }
});

const getClasses = ({variant, color, position, classes: {root, badge, ...myClasses}}) => ({
    root: classnames(
        root,
        myClasses[variant],
        myClasses['color' + _.capitalize(color)],
        myClasses['position' + _.capitalize(position)]
    ),
    badge
});

const Badge = withStyles(styles, {name: 'DsBadge'})(
    ({variant, color, position, classes, icon, children, ...props}) => (
        <MuiBadge
            classes={getClasses({
                variant, color, position, classes
            })}
            {...props}
        >
            {children}
            {icon}
        </MuiBadge>
    )
);

Badge.propTypes = process.env.NODE_ENV !== 'production' ? {
    icon: PropTypes.node,
    variant: PropTypes.oneOf(['normal', 'dot', 'circle'])
} : {};

Badge.defaultProps = {
    color: 'primary',
    variant: 'normal',
    position: 'inline'
};

Badge.displayName = 'DsBadge';

export default Badge;
