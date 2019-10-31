import PropTypes from 'prop-types';
import React from 'react';
import {Drawer, List, ListItem, withStyles} from '@material-ui/core';
import classNames from 'classnames';
import BurgerMenuButton from './BurgerMenuButton';
import {DisplayActions} from '@jahia/react-material';
import LeftMenuItem from './LeftMenuItem';
import {compose} from 'recompose';
import styleConstants from '../../theme/styleConstants';

const styles = theme => ({
    root: {
        minWidth: (styleConstants.screenMargin + styleConstants.leftNavigationWidth) + 'px',
        paddingLeft: theme.spacing.unit * 4,
        display: 'flex',
        flexDirection: 'column'
    },
    rootOpenDrawer: {
        zIndex: theme.zIndex.modal,
        background: theme.palette.background.paper,
        overflow: 'visible !important', // Safari compatibility
        '-webkit-transform-style': 'preserve-3d' // Safari compatibility
    },
    rootClosedDrawer: {
        background: theme.palette.layout.dark,
        overflow: 'hidden'
    },
    spacer: {
        flex: '1 1 0%'
    },
    menuBurger: {
        paddingRight: '0px !important',
        paddingTop: '34px !important',
        paddingLeft: '0px !important',
        paddingBottom: '22px !important',
        boxShadow: 'none !important',
        background: 'none!important',
        transition: 'none'
    },
    drawerPaper: {
        background: theme.palette.background.paper,
        position: 'absolute',
        boxShadow: '2px 0 1px -2px rgba(0, 0, 21, 0.29)',
        left: (styleConstants.screenMargin + styleConstants.leftNavigationWidth),
        width: styleConstants.leftNavigationDrawerWidth
    },
    drawerPaperClose: {
        width: 0,
        overflowX: 'hidden'
    },
    list: {
    },
    listBottom: {
    },
    drawerTree: {
        marginTop: '18px'
    }
});

export const LeftNavigation = ({context, classes, actionsTarget, secondaryActionsTarget, drawer}) => {
    let actionContext = {
        ...context,
        drawer
    };

    return (
        <div className={classNames(classes.root, {
            [classes.rootOpenDrawer]: drawer.drawerOpen,
            [classes.rootClosedDrawer]: !drawer.drawerOpen
        })}
        >
            <List className={classes.list} component="nav">
                <ListItem button className={classes.menuBurger}>
                    <BurgerMenuButton isDrawerOpen={drawer.drawerOpen}/>
                </ListItem>
                <DisplayActions target={actionsTarget}
                                context={actionContext}
                                render={({context}) => (
                                    <LeftMenuItem context={context} drawer={drawer.drawerOpen}/>
                                )}/>

            </List>
            <div className={classes.spacer}/>
            <List className={classes.listBottom} component="nav">
                <DisplayActions target={secondaryActionsTarget}
                                context={actionContext}
                                render={({context}) => (
                                    <LeftMenuItem context={context} drawer={drawer.drawerOpen}/>
                                )}
                />
            </List>
            <Drawer
                variant="persistent"
                classes={{
                    paper: classNames(classes.drawerPaper, !drawer.drawerOpen && classes.drawerPaperClose)
                }}
                open={drawer.drawerOpen}
            >
                <div className={classes.drawerTree}>
                    {drawer.drawerContent &&
                    drawer.drawerContent.content}
                </div>
            </Drawer>
        </div>
    );
};

LeftNavigation.propTypes = {
    actionsTarget: PropTypes.string.isRequired,
    secondaryActionsTarget: PropTypes.string.isRequired,
    context: PropTypes.object.isRequired,
    drawer: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

export default compose(
    withStyles(styles, {withTheme: true})
)(LeftNavigation);
