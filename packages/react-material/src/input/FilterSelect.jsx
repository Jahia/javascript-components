import React from 'react';
import PropTypes from 'prop-types';
import Select, {components} from 'react-select';
import {ArrowDropDown as ArrowDropDownIcon} from '@material-ui/icons';
import {Input, MenuItem, ListItemText, ListItemIcon, withStyles} from '@material-ui/core';
import * as _ from 'lodash';

const styles = () => ({
    root: {
        display: 'inline-block',
        minWidth: 200
    }
});

const ITEM_HEIGHT = 48;

const customStyles = {
    control: () => ({
        display: 'flex',
        alignItems: 'center',
        border: 0,
        height: 'auto',
        background: 'transparent',
        '&:hover': {
            boxShadow: 'none'
        }
    }),
    menu: () => ({
        backgroundColor: 'white',
        boxShadow: '1px 2px 6px #888888', // Should be changed as material-ui
        position: 'absolute',
        left: 0,
        top: 'calc(100% + 1px)',
        width: '100%',
        zIndex: 2,
        maxHeight: ITEM_HEIGHT * 4.5
    }),
    dropdownIndicator: () => ({
        padding: 0
    }),
    clearIndicator: () => ({
        padding: 0
    }),
    menuList: () => ({
        maxHeight: ITEM_HEIGHT * 4.5,
        overflowY: 'auto'
    })
};

class Option extends React.Component {
    render() {
        const {data, children, isFocused, isSelected, onFocus} = this.props;

        return (
            <MenuItem
                selected={isFocused}
                component='div'
                style={{
                    fontWeight: isSelected ? 500 : 400
                }}
                title={data.title}
                onFocus={onFocus}
                onClick={event => {
                    this.props.selectOption(this.props.data, event);
                }}
            >
                {data.icon !== null && (
                    <ListItemIcon>
                        <img src={data.icon + '.png'}/>
                    </ListItemIcon>
                )}
                <ListItemText>
                    {children}
                </ListItemText>
            </MenuItem>
        );
    }
}

Option.defaultProps = {
    children: null,
    isFocused: false,
    isSelected: false
};

Option.propTypes = {
    children: PropTypes.element,
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
    data: PropTypes.object.isRequired,
    onFocus: PropTypes.func.isRequired,
    selectOption: PropTypes.func.isRequired
};

class DropdownIndicator extends React.Component {
    render() {
        return (
            <components.DropdownIndicator {...this.props}>
                <ArrowDropDownIcon/>
            </components.DropdownIndicator>
        );
    }
}

class SelectWrapped extends React.Component {
    render() {
        const {classes, value, options, ...other} = this.props;
        const optionValue = _.find(options, data => data.value === value);

        return (
            <Select
                isClearable
                components={{
                    Option,
                    DropdownIndicator,
                    IndicatorSeparator: () => false
                }}
                styles={customStyles}
                options={options}
                value={optionValue}
                {...other}
            />
        );
    }
}

SelectWrapped.defaultProps = {
    options: []
};

SelectWrapped.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    options: PropTypes.array
};

class FilterSelectCmp extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(data) {
        let newValue = null;
        if (data !== null) {
            newValue = data.value;
        }

        if (this.props.onChange !== undefined) {
            this.props.onChange(newValue);
        }
    }

    render() {
        const {classes, options, value, onChange, ...other} = this.props;

        return (
            <Input
                fullWidth
                classes={classes}
                inputComponent={SelectWrapped}
                value={value}
                inputProps={{
                    options,
                    ...other
                }}
                onChange={this.handleChange}
            />
        );
    }
}

FilterSelectCmp.defaultProps = {
    value: null,
    onChange: null
};

FilterSelectCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func
};

export const FilterSelect = _.flowRight(
    withStyles(styles)
)(FilterSelectCmp);
