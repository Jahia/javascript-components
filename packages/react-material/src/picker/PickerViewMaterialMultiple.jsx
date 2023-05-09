import React from 'react';
import {IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, withTheme} from '@material-ui/core';
import {ExpandLess, ExpandMore, CheckBoxOutlineBlank, CheckBox} from '@material-ui/icons';
import PropTypes from 'prop-types';

let PickerViewMaterialMultiple = props => (
    <List>
        {props.pickerEntries.map(entry => (
            <ListItem
key={entry.path}
button
onClick={() => entry.selectable ? props.onSelectItem(entry.path, !entry.selected, true) : props.onOpenItem(entry.path, !entry.open)}
            >
                <ListItemIcon style={entry.selectable ? {} : {opacity: 0}}>{entry.selected ? <CheckBox/>
                    : <CheckBoxOutlineBlank/>}
                </ListItemIcon>
                <ListItemText
                                  inset
                                  primary={props.textRenderer ? props.textRenderer.call(this, entry) : entry.name}
                                  style={{paddingLeft: entry.depth * props.theme.spacing.unit}}
                                  />
                <ListItemSecondaryAction>
                    {entry.openable && entry.hasChildren ? (
                        <IconButton onClick={() => props.onOpenItem(entry.path, !entry.open)}>{entry.open
                                ? <ExpandLess/> : <ExpandMore/>}
                        </IconButton>) : null}
                </ListItemSecondaryAction>
            </ListItem>
                )
            )}
    </List>
);

PickerViewMaterialMultiple.defaultProps = {
    onSelectItem() {},
    onOpenItem() {},
    textRenderer() {}
};

PickerViewMaterialMultiple.propTypes = {
    pickerEntries: PropTypes.array.isRequired,
    onSelectItem: PropTypes.func,
    onOpenItem: PropTypes.func,
    textRenderer: PropTypes.func,
    theme: PropTypes.object.isRequired
};

PickerViewMaterialMultiple = withTheme()(PickerViewMaterialMultiple);

export {PickerViewMaterialMultiple};
