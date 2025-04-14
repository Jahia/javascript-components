import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
/* Wrapped component */
import {ExpansionPanel as MuiExpansionPanel, withStyles} from '@material-ui/core';
import PropTypeConstants from '../PropTypesConstants';
import * as _ from 'lodash';

/* Styles applied in the component.
* root: the style of the component itself
* attributeValue: when an attribute is set
*/
const styles = theme => ({
    root: {
        position: 'relative',
        boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
        margin: '0 0 ' + theme.spacing.unit + 'px 0',
        '&:before': {
            position: 'absolute',
            left: 0,
            top: -1,
            right: 0,
            height: 1,
            content: '""',
            opacity: 1,
            backgroundColor: theme.palette.divider
        },
        '&:first-child': {
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            '&:before': {
                display: 'none'
            }
        },
        '&$expanded + &': {
            '&:before': {
                display: 'none'
            }
        }
    },
    normal: {
        borderRadius: 1,
        border: 'solid 1px ' + theme.palette.ui.omega,
        '&:focus': {
            backgroundColor: theme.palette.ui.omega
        }
    },
    ghost: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        border: 'none',
        '&:hover': {
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: theme.palette.ui.omega
        }
    },
    expanded: {
        margin: (theme.spacing.unit * 2) + 'px 0',
        boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.2)'
        },
        '&:first-child': {
            marginTop: 0
        },
        '&:last-child': {
            marginBottom: 0
        },
        '&:before': {
            opacity: 0
        }
    },
    colorDefault: {
        backgroundColor: theme.palette.ui.epsilon,
        color: theme.palette.font.alpha
    },
    colorInverted: {
        backgroundColor: theme.palette.ui.beta,
        color: theme.palette.invert.beta,
        border: 'solid 1px ' + theme.palette.invert.alpha
    },

    ghostDisabled: {
        backgroundColor: theme.palette.ui.beta
    },
    /* Styles applied to the root element if `disabled={true}`. */
    disabled: {
        backgroundColor: 'inherit',
        color: theme.palette.font.gamma,
        boxShadow: 'none',
        cursor: 'not-allowed',
        '& :first-child': {
            opacity: 0.5
        },
        '& :last-child': {
            opacity: 0.5
        },
        '&:hover': {
            boxShadow: 'none'
        }
    }
});

/*
   Set custom classes of component
 */
const getClasses = ({variant, color, classes: {root, disabled, expanded, defaultExpanded, ...dsClasses}}) => ({
    root: classnames(
        root,
        dsClasses[variant],
        dsClasses['color' + _.capitalize(color)]
    ),
    disabled,
    expanded,
    defaultExpanded
});

/*
   Spread new classes into original component
 */
const ExpansionPanel = withStyles(styles, {name: 'DsExpansionPanel'})(
    ({variant, color, classes, ...props}) => (
        <MuiExpansionPanel classes={getClasses({variant, color, classes})} {...props}/>
    )
);

/*
  Proptype of component
 */
ExpansionPanel.propTypes = process.env.NODE_ENV === 'production' ? {} : {
    variant: PropTypeConstants.ExpansionPanelVariants,
    color: PropTypeConstants.ExpansionPanelColors,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    CollapseProps: PropTypes.object,
    defaultExpanded: PropTypes.bool,
    disabled: PropTypes.bool,
    expanded: PropTypes.bool,
    onChange: PropTypes.func
};

/*
   Default Props
 */
ExpansionPanel.defaultProps = {
    variant: 'normal',
    color: 'default',
    defaultExpanded: false,
    disabled: false
};

ExpansionPanel.displayName = 'DsExpansionPanel';

export default ExpansionPanel;
