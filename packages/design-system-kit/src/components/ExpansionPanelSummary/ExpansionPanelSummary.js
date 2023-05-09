import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
/* Wrapped component */
import {ExpansionPanelSummary as MuiExpansionPanelSummary, withStyles} from '@material-ui/core';

/* Styles applied in the component.
* root: the style of the component itself
* attributeValue: when an attribute is set
*/
const styles = theme => ({
    root: {
        display: 'flex',
        minHeight: 8 * 6,
        padding: theme.spacing.unit + 'px ' + (theme.spacing.unit * 4) + 'px ' + theme.spacing.unit + 'px ' + (theme.spacing.unit * 4) + 'px',
        borderRadius: 1,
        '&:hover:not($disabled)': {
            cursor: 'pointer'
        },
        '&$expanded': {
            minHeight: 64
        },
        '&$focused': {},
        '&$disabled': {
            opacity: 0.38
        }
    },
    expandIcon: {
        color: 'inherit'
    },
    disabled: {},
    expanded: {},
    focused: {
        backgroundColor: theme.palette.ui.omega
    },
    content: {
        display: 'flex',
        flexGrow: 1,
        margin: '26px 0',
        '& > :last-child': {
            paddingRight: theme.spacing.unit * 4
        },
        '&$expanded': {
            margin: '28px 0'
        }
    }
});

/*
   Set custom classes of component
 */
const getClasses = ({variant, classes: {root, expanded, disabled, focused, expandIcon, content, ...dsClasses}}) => ({
    root: classnames(
        root,
        dsClasses[variant]
    ),
    expanded,
    disabled,
    expandIcon,
    focused,
    content
});

/*
   Spread new classes into original component
 */
const ExpansionPanelSummary = withStyles(styles, {name: 'DsExpansionPanelSummary'})(
    ({variant, classes, focused, content, expanded, disabled, ...props}) => (
        <MuiExpansionPanelSummary classes={getClasses({variant, expanded, disabled, focused, content, classes})} {...props}/>
    )
);

/*
  Proptype of component
 */
ExpansionPanelSummary.propTypes = process.env.NODE_ENV !== 'production' ? {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    expanded: PropTypes.bool,
    expandIcon: PropTypes.node,
    IconButtonProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onFocusVisible: PropTypes.func
} : {};

/*
   Default Props
 */
ExpansionPanelSummary.defaultProps = {
    disabled: false
};

ExpansionPanelSummary.displayName = 'DsExpansionPanelSummary';
ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

export default ExpansionPanelSummary;
