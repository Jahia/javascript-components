import React, {useState} from 'react';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => {
    // DESIGN-178 - use theme colors
    theme.palette.ui.zeta = '#C1C8D5';

    const switchBase = {
        '&$checked + $bar': {
            opacity: 0.5,
            backgroundColor: theme.palette.brand.gamma
        }
    };

    const hoverSwitchBase = {
        '&:hover $icon': {
            color: theme.palette.hover.beta
        },
        '&$checked:hover $iconChecked': {
            color: theme.palette.brand.alpha
        },
        '&$checked:hover + $bar': {
            opacity: 1
        }
    };

    return {
        root: {
            marginLeft: -(theme.spacing.unit + 3)
        },
        icon: {
            color: theme.palette.ui.epsilon,
            border: `1px solid ${theme.palette.ui.zeta}`,
            boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
            boxSizing: 'border-box'
        },
        iconChecked: {
            color: theme.palette.brand.beta,
            border: 'none'
        },
        switchBase: {
            ...switchBase,
            ...hoverSwitchBase
        },
        focusedSwitchBase: {
            ...switchBase,
            ...hoverSwitchBase,
            '&::before': {
                position: 'absolute',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                zIndex: '-1',
                content: '""',
                background: theme.palette.ui.delta,
                opacity: '0.2',
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)'
            },
            '&$checked::before': {
                background: theme.palette.brand.beta
            },
            '& $icon': {
                boxShadow: 'none'
            }
        },
        readOnlySwitchBase: {
            ...switchBase,
            boxShadow: 'none !important',
            pointerEvents: 'none !important',
            '&$checked $iconChecked': {
                color: theme.palette.brand.gamma
            },
            '& $icon': {
                boxShadow: 'none'
            }
        },
        disabledSwitchBase: {
            boxShadow: 'none !important',
            pointerEvents: 'none !important',
            '&$checked $iconChecked': {
                color: theme.palette.ui.delta
            },
            '& $icon': {
                boxShadow: 'none'
            },
            '&$checked + $bar': {
                opacity: 0.5,
                backgroundColor: theme.palette.ui.delta
            },
            '& + $bar': {
                backgroundColor: theme.palette.font.gamma
            }
        },
        bar: {
            backgroundColor: theme.palette.ui.zeta
        },
        checked: {}
    };
};

const ToggleCmp = ({classes, checked, disabled, readOnly, onChange, onFocus, onBlur, ...others}) => {
    const [focus, setFocus] = useState(false);

    const handleFocus = () => {
        onFocus();
        setFocus(true);
    };

    const handleBlur = () => {
        onBlur();
        setFocus(false);
    };

    const readOnlyProps = readOnly ? {
        tabindex: '0' // Allow the user to focus the field in case of readonly, even if it cannot modify the value
    } : {};

    const getSwitchBaseClass = () => {
        if (disabled) {
            return classes.disabledSwitchBase;
        }

        if (readOnly) {
            return classes.readOnlySwitchBase;
        }

        if (focus) {
            return classes.focusedSwitchBase;
        }

        return classes.switchBase;
    };

    return (
        <Switch
            disableRipple
            classes={{
                root: classes.root,
                icon: classes.icon,
                iconChecked: classes.iconChecked,
                switchBase: getSwitchBaseClass(),
                bar: classes.bar,
                checked: classes.checked
            }}
            checked={checked}
            disabled={disabled || readOnly}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...others}
            {...readOnlyProps}
        />
    );
};

ToggleCmp.defaultProps = {
    classes: {},
    checked: false,
    disabled: false,
    readOnly: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onBlur() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onFocus() {}
};

ToggleCmp.propTypes = {
    classes: PropTypes.object,
    // eslint-disable-next-line react/boolean-prop-naming
    checked: PropTypes.bool,

    disabled: PropTypes.bool,

    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
};

export const Toggle = withStyles(styles)(ToggleCmp);
