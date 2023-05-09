import React from 'react';
import {FormControlLabel as MuiFormControlLabel, withStyles} from '@material-ui/core';
import * as _ from 'lodash';
import classnames from 'classnames';

const styles = () => ({
    /* Styles applied to the root element. */
    root: {},

    /* Styles applied to the root element if `labelPlacement="start"`. */
    labelPlacementStart: {},

    /* Styles applied to the root element if `labelPlacement="top"`. */
    labelPlacementTop: {},

    /* Styles applied to the root element if `labelPlacement="bottom"`. */
    labelPlacementBottom: {},

    /* Styles applied to the root element if `disabled={true}`. */
    disabled: {
        '& svg': {
            opacity: 1
        }
    },

    /* Styles applied to the label's Typography component. */
    label: {}
});

const getClasses = ({variant, color, classes: {root, labelPlacementStart, labelPlacementTop, labelPlacementBottom, disabled, label, ...myClasses}}) => ({
    root: classnames(
        root,
        myClasses[variant],
        myClasses['color' + _.capitalize(color)]
    ),
    labelPlacementStart,
    labelPlacementTop,
    labelPlacementBottom,
    disabled,
    label
});

const FormControlLabel = withStyles(styles, {name: 'DsFormControlLabel'})(
    ({variant, color, classes, ...props}) => (
        <MuiFormControlLabel classes={getClasses({variant, color, classes})} {...props}/>
    )
);

FormControlLabel.propTypes = process.env.NODE_ENV !== 'production' ? {
} : {};

FormControlLabel.defaultProps = {
    labelPlacement: 'end'
};

FormControlLabel.displayName = 'DsFormControlLabel';

export default FormControlLabel;
