import React from 'react';
import {Chip as MuiChip, withStyles} from '@material-ui/core';
import * as _ from 'lodash';
import classnames from 'classnames';
import PropTypesConstants from '../PropTypesConstants';

const styles = theme => ({
    root: {
        borderRadius: '4px'
    },
    primary: {
        background: theme.palette.brand.beta,
        color: theme.palette.invert.beta
    },
    iconPrimary: {
        color: theme.palette.invert.beta
    },
    secondary: {
        background: 'transparent',
        color: theme.palette.font.alpha
    },
    iconSecondary: {
        color: theme.palette.font.alpha
    },
    colorInverted: {
        color: theme.palette.invert.beta
    },
    deleteIcon: {
        color: theme.palette.ui.omega
    },
    sizeNormal: {
        // Todo normal size CSS
    },
    sizeCompact: {
        // Todo compact size CSS
    }
});

const getClasses = ({
    variant,
    color,
    size,
    classes: {root, icon, deleteIcon, ...myClasses}
}) => ({
    root: classnames(
        root,
        myClasses[variant],
        myClasses['color' + _.capitalize(color)],
        myClasses['size' + _.capitalize(size)]
    ),
    icon: classnames(icon, myClasses['icon' + _.capitalize(variant)]),
    deleteIcon
});

const Chip = withStyles(styles, {name: 'DsChip'})(
    ({variant, color, size, classes, ...props}) => (
        <MuiChip
            classes={getClasses({variant, color, size, classes})}
            {...props}
        />
    )
);

Chip.propTypes =
    process.env.NODE_ENV !== 'production' ?
        {
            size: PropTypesConstants.ChipSizes,
            color: PropTypesConstants.ChipColors,
            variant: PropTypesConstants.ChipVariants
        } :
        {};

Chip.defaultProps = {
    color: 'default',
    variant: 'primary',
    size: 'normal'
};

Chip.displayName = 'DsChip';

export default Chip;
