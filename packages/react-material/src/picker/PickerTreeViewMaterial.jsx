import React from 'react';
import PropTypes from 'prop-types';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    withStyles,
    withTheme
} from '@material-ui/core';
import {IconButton, Typography} from '@jahia/design-system-kit';
import {KeyboardArrowRight} from '@material-ui/icons';
import defaultIconRenderer from './iconRenderer';
import {compose} from 'react-apollo';
import classNames from 'classnames';

let styles = theme => ({
    root: {
        position: 'relative',
        padding: '0 !important',
        width: '100%'
    },
    loading: {
        left: '17%',
        position: 'fixed',
        top: '50%'
    },
    listItemSelected: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText + '!important'
    },
    listItem: {
        paddingLeft: theme.spacing.unit,
        height: theme.spacing.unit * 6,
        whiteSpace: 'nowrap',
        color: theme.palette.text.secondary
    },
    listItemDeleted: {
        color: theme.palette.text.disabled,
        textDecoration: 'line-through'
    },
    listItemNodeTypeIcon: {
        marginRight: '5px',
        color: 'inherit'
    },
    listItemActionIcon: {
        position: 'absolute',
        height: '48px',
        width: '48px',
        top: '0px',
        '& button': {
            width: '48px'
        }
    },
    openedTreeEl: {
        transform: 'rotate(90deg)',
        color: 'inherit'
    },
    closedTreeEl: {
        color: 'inherit'
    },
    treeEntry: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer !important'
    },
    unpublishedEntryLabel: {
        fontStyle: 'italic'
    }
});

class PickerTreeViewMaterialCmp extends React.Component {
    render() {
        let {classes, pickerEntries, onOpenItem, onSelectItem, rootLabel, iconRenderer, loading, dataCmRole} = this.props;
        // Sorts entries that are folder types
        let sortedEntries = this.sortFoldersAlphabetical(pickerEntries);

        return (
            <div className={classes.root}>
                {loading &&
                <CircularProgress classes={{root: classes.loading}}/>}
                <List disablePadding classes={{root: classes.root}}>
                    {
                        sortedEntries.map(entry => {
                            let itemClass = classNames(classes.listItem, {
                                // [classes.listItemDeleted]: isMarkedForDeletion(entry.node), TODO handle marked for deletion from CMM to be added
                                [classes.listItemSelected]: entry.selected
                            });
                            return (
                                <ListItem
                                    key={entry.path}
                                    data-jrm-role="picker-item"
                                    data-cm-role={dataCmRole}
                                    className={itemClass}
                                    onDoubleClick={() => onOpenItem(entry.path, !entry.open)}
                                >
                                    <div
                                        style={{
                                            paddingLeft: ((entry.depth > 0) ? ((entry.depth) * 16) : 0),
                                            opacity: (entry.openable && entry.hasChildren ? 1 : 0)
                                        }}
                                    >
                                        <IconButton
                                            icon={<KeyboardArrowRight/>}
                                            className={entry.open ? classes.openedTreeEl : classes.closedTreeEl}
                                            disabled={!(entry.openable && entry.hasChildren)}
                                            data-jrm-role="picker-item-toggle"
                                            data-jrm-state={entry.open ? 'open' : 'closed'}
                                            onClick={event => {
                                                onOpenItem(entry.path, !entry.open);
                                                event.stopPropagation();
                                            }}
                                        />
                                    </div>
                                    <span
                                        className={classes.treeEntry}
                                        onClick={() => entry.selectable ? onSelectItem(entry.path, !entry.selected) : null}
                                    >
                                        <ListItemIcon className={classes.listItemNodeTypeIcon}>
                                            {iconRenderer(entry)}
                                        </ListItemIcon>
                                        <ListItemText
                                                disableTypography
                                                inset
                                                className={entry.node.primaryNodeType.name === 'jnt:page' && entry.node.publicationStatus && entry.node.publicationStatus.publicationStatus === 'UNPUBLISHED' ? classes.unpublishedEntryLabel : null}
                                                primary={
                                                    <React.Fragment>
                                                        <Typography color="inherit">
                                                            {entry.depth > 0 ? entry.node.displayName : rootLabel}
                                                        </Typography>
                                                    </React.Fragment>
                                                }
                                                data-jrm-role="picker-item-text"
                                            />
                                    </span>
                                </ListItem>
                            );
                        })
                    }
                </List>
            </div>
        );
    }

    sortFoldersAlphabetical(pickerEntries) {
        if (pickerEntries.length !== 0 && pickerEntries[0] && (pickerEntries[0].node.primaryNodeType.name === 'jnt:contentFolder' || pickerEntries[0].node.primaryNodeType.name === 'jnt:folder')) {
            const rootNode = this.reconstructNodeHierarchy(JSON.parse(JSON.stringify(pickerEntries)));
            return this.sortAndFlatten(rootNode);
        }

        return pickerEntries;
    }

    reconstructNodeHierarchy(pickerEntriesSortedByPath) {
        const hierarchyStack = [];

        // Add root node to stack
        hierarchyStack.push(pickerEntriesSortedByPath.splice(0, 1)[0]);

        while (pickerEntriesSortedByPath.length !== 0 && hierarchyStack.length !== 0) {
            const currentPickerEntry = pickerEntriesSortedByPath[0];
            const top = hierarchyStack[hierarchyStack.length - 1];

            // Add children to top of the stack if current entry is child of top
            if (currentPickerEntry.path.indexOf(top.path) !== -1 && currentPickerEntry.path.replace(top.path, '')[0] === '/') {
                if (!top.children) {
                    top.children = [];
                }

                top.children.push(currentPickerEntry);
                hierarchyStack.push(currentPickerEntry);
                pickerEntriesSortedByPath.splice(0, 1);
            } else {
                hierarchyStack.pop();
            }
        }

        return hierarchyStack[0];
    }

    sortAndFlatten(rootNode) {
        const flatArray = [];

        dfs(rootNode);

        function dfs(node) {
            flatArray.push(node);
            if (node.children) {
                node.children.sort(function (a, b) {
                    const A = a.node.displayName.toLocaleLowerCase();
                    const B = b.node.displayName.toLocaleLowerCase();
                    if (A < B) {
                        return -1;
                    }

                    if (A > B) {
                        return 1;
                    }

                    return 0;
                });

                for (let i = 0; i < node.children.length; i++) {
                    dfs(node.children[i]);
                }
            }
        }

        return flatArray;
    }
}

PickerTreeViewMaterialCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    dataCmRole: PropTypes.string.isRequired,
    iconRenderer: PropTypes.func,
    // eslint-disable-next-line react/boolean-prop-naming
    loading: PropTypes.bool.isRequired,
    onOpenItem: PropTypes.func,
    onSelectItem: PropTypes.func,
    pickerEntries: PropTypes.array.isRequired,
    rootLabel: PropTypes.string.isRequired
};

PickerTreeViewMaterialCmp.defaultProps = {
    iconRenderer: defaultIconRenderer,
    onSelectItem: () => {},
    onOpenItem: () => {}
};

export const PickerTreeViewMaterial = compose(
    withTheme(),
    withStyles(styles, {name: 'DxPickerTreeViewMaterial'})
)(PickerTreeViewMaterialCmp);
