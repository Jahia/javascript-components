import React from 'react';
import classnames from 'classnames';
/* Wrapped component */
import {Select as MuiSelect, withStyles} from '@material-ui/core';
import PropTypeConstants from '../PropTypesConstants';
import * as _ from 'lodash';

/* Styles applied in the component.
* root: the style of the component itself
* attributeValue: when an attribute is set
*/
let styles = theme => ({
    root: {},
    normal: {},
    ghost: {
        '& $select': {
            color: theme.palette.brand.alpha,
            backgroundColor: 'transparent'
        },
        '& $select:focus': {
            boxShadow: 'unset'
        },
        '& $icon': {
            color: theme.palette.brand.alpha
        }
    },
    colorInverted: {},
    colorDefault: {},
    select: {
        '&:focus': {
            backgroundColor: 'transparent'
        }
    },
    selectMenu: {},
    icon: {
        top: 'calc(50% - 10px)'
    },
    disabled: {}
});

/*
   Set custom classes of component
 */
const getClasses = ({variant, color, classes: {root, select, selectMenu, icon, disabled, ...dsClasses}}) => ({
    root: classnames(
        root,
        dsClasses[variant],
        dsClasses['color' + _.capitalize(color)]
    ),
    select,
    selectMenu,
    icon,
    disabled
});

/*
   Spread new classes into original component
 */
const Select = withStyles(styles, {name: 'DsSelect'})(
    ({variant, color, classes, ...props}) => (
        <MuiSelect disableUnderline classes={getClasses({variant, color, classes})} {...props}/>
    )
);

/*
  Proptype of component
 */
Select.propTypes = process.env.NODE_ENV !== 'production' ? {
    color: PropTypeConstants.SelectColors,
    variant: PropTypeConstants.SelectVariants
} : {};

/*
   Default Props
 */
Select.defaultProps = {
    autoWidth: false,
    displayEmpty: false,
    multiple: false,
    native: false
};

Select.displayName = 'DsSelect';

export default Select;
