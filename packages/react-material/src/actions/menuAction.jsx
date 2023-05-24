import React from 'react';
import {Menu, MenuItem, ModalManager} from '@material-ui/core';
import {Translation} from 'react-i18next';
import {componentRendererAction} from './componentRendererAction';
import {composeActions} from './composeActions';
import {DisplayActions} from './DisplayActions';
import {withStylesAction} from './withStylesAction';
import {ArrowRight} from '@material-ui/icons';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {pure} from 'recompose';
import {toIconComponent} from './toIconComponent';
import {ListItemIcon} from '@jahia/design-system-kit';

const styles = {
    modalRoot: {
        pointerEvents: 'none'
    },
    paperRoot: {
        pointerEvents: 'initial'
    },
    loading: {
        opacity: 0
    },
    emptyMenuItem: {
        display: 'none'
    },
    empty: {
        '& $emptyMenuItem': {
            display: 'block'
        }
    },
    noIcon: {
        width: 20,
        height: 20
    }
};

const setActionsRef = (ref, context) => {
    if (ref) {
        if (menuStatus[context.id].menuSubscription) {
            menuStatus[context.id].menuSubscription.unsubscribe();
            delete menuStatus[context.id].menuSubscription;
        }

        menuStatus[context.id].menuSubscription = combineLatest(ref.observerRefs).subscribe(() => {
            if (menuStatus[context.id]) {
                menuStatus[context.id].onMenuLoaded(context.menuDisplayed);
            }
        });
    }
};

const menuStatus = {};

const preload = context => {
    context.obs = {enabled: new BehaviorSubject(false)};
    context.enabled = context.obs.enabled;

    const currentPreloadMenuHandler = context.renderComponent(<DisplayActions
target={context.menu}
context={{
                                                                             ...context.originalContext,
                                                                             displayDisabled: context.menuDisplayDisabled,
                                                                             parent: context
                                                                         }}
render={
                                                                             () => {
                                                                                 context.obs.enabled.next(true);
                                                                                 return false;
                                                                             }
                                                                         }/>);
    menuStatus[context.id] = {
        open: false,
        inMenu: false,
        preload: currentPreloadMenuHandler
    };
};

const PureMenu = pure(Menu);

const display = (context, anchor) => {
    // Disable backdrop for sub menus, click through to main menu backdrop
    const subMenuProps = (context.parent) ? {
        ModalClasses: {root: context.classes.modalRoot},
        classes: {paper: context.classes.paperRoot},
        disableEnforceFocus: true,
        manager: new ModalManager({hideSiblingNodes: false})
    } : {};

    if (!menuStatus[context.id]) {
        menuStatus[context.id] = {
            open: false,
            inMenu: false
        };
    }

    const {showIcons} = context;
    const noIconClass = context.classes.noIcon;

    menuStatus[context.id].open = true;
    context.currentMenuHandler = context.renderComponent(
        <PureMenu open
                  className={context.classes.loading}
                  id={'menu-' + context.id}
                  {...anchor}
                  action={c => {
                      menuStatus[context.id].onMenuLoaded = displayed => {
                          if (menuStatus[context.id].open) {
                              c.updatePosition();
                              context.currentMenuHandler.setProps({className: displayed ? '' : context.classes.empty});
                          }
                      };
                  }}
                  BackdropProps={{
                      invisible: true,
                      onContextMenu(e) {
                          e.preventDefault();
                          context.currentMenuHandler.setProps({open: false});
                      }
                  }}
                  onClose={() => {
                      context.currentMenuHandler.setProps({open: false});
                  }}
                  onExit={() => {
                      menuStatus[context.id].open = false;
                      if (context.onExit) {
                          context.onExit(context);
                      }

                      if (menuStatus[context.id].menuSubscription) {
                          menuStatus[context.id].menuSubscription.unsubscribe();
                          delete menuStatus[context.id].menuSubscription;
                      }

                      // Close sub menu if they exist
                      if (context.currentOpenSubmenuContext) {
                          context.currentOpenSubmenuContext.currentMenuHandler.setProps({open: false});
                      }
                  }}
                  onExited={() => {
                      // Free resources after exit
                      context.currentMenuHandler.destroy();
                      delete menuStatus[context.id];
                  }}
                  onMouseEnter={() => {
                      menuStatus[context.id].inMenu = true;
                  }}
                  onMouseLeave={() => {
                      menuStatus[context.id].inMenu = false;
                  }}
                  {...subMenuProps}
        >
            <Translation>{t => (
                <React.Fragment>
                    {context.menuEmptyMessage &&
                        <MenuItem disabled classes={{root: context.classes.emptyMenuItem}}>{t(context.menuEmptyMessage)}</MenuItem>}
                    <DisplayActions ref={r => setActionsRef(r, context)}
                                    context={{
                                        ...context.originalContext,
                                        displayDisabled: context.menuDisplayDisabled,
                                        parent: context
                                    }}
                                    filter={context.menuFilter}
                                    render={
                                        ({context}) => {
                                            context.parent.menuDisplayed = true;
                                            const disabled = context.enabled !== null && context.enabled === false;
                                            return (
                                                <MenuItem data-sel-role={context.key}
                                                          data-sel-disabled={disabled}
                                                          disabled={disabled}
                                                          onClick={e => {
                                                              // First close all menu by closing main menu
                                                              let rootContext = context;
                                                              while (rootContext.parent && rootContext.parent.currentMenuHandler) {
                                                                  rootContext = rootContext.parent;
                                                              }

                                                              rootContext.currentMenuHandler.setProps({open: false});
                                                              // Send click event
                                                              context.onClick(context, e);
                                                          }}
                                                          onMouseEnter={e => {
                                                              // If a submenu was open, close it
                                                              if (context.parent.currentOpenSubmenuContext) {
                                                                  context.parent.currentOpenSubmenuContext.currentMenuHandler.setProps({open: false});
                                                              }

                                                              // Send mouseEnter event
                                                              if (context.onMouseEnter) {
                                                                  context.onMouseEnter(context, e);
                                                              }
                                                          }}
                                                          onMouseLeave={context.onMouseLeave && (e => {
                                                              context.onMouseLeave(context, e);
                                                          })}
                                                >
                                                    {showIcons && (
                                                        <ListItemIcon>
                                                            {context.buttonIcon ?
                                                                toIconComponent(context.buttonIcon) :
                                                                <span className={noIconClass}/>}
                                                        </ListItemIcon>
                                                    )}
                                                    {/* eslint-disable-next-line react/no-danger */}
                                                    <span dangerouslySetInnerHTML={{__html: t(context.buttonLabel, context.buttonLabelParams)}}/>
                                                    {context.icon}
                                                </MenuItem>
                                            );
                                        }
                                    }
                                    target={context.menu}
                    />
                </React.Fragment>
            )}
            </Translation>
        </PureMenu>
    );
};

const menuAction = composeActions(componentRendererAction, withStylesAction(styles), {

    init(context) {
        if (!context.icon) {
            context.icon = <ArrowRight/>;
        }

        context.menuDisplayed = false;
        if (context.menuPreload) {
            preload(context);
        }
    },

    destroy(context) {
        if (menuStatus[context.id] && menuStatus[context.id].preload) {
            menuStatus[context.id].preload.destroy();
        }
    },

    onMouseEnter(context, e) {
        if (context.parent && menuStatus[context.parent.id].open) {
            // Open submenu on mouseEnter
            context.parent.currentOpenSubmenuContext = context;
            const b = e.currentTarget.getBoundingClientRect();
            display(context, {anchorPosition: {left: b.left + b.width, top: b.top}, anchorReference: 'anchorPosition'});
        }
    },

    onMouseLeave(context) {
        if (context.parent && context.parent.currentOpenSubmenuContext) {
            // Close submenu on mouseLeave - first check if the pointer has not left for the menu itself
            setTimeout(() => {
                if ((!menuStatus[context.id] || !menuStatus[context.id].inMenu) && context.parent.currentOpenSubmenuContext && context.parent.currentOpenSubmenuContext.key === context.key) {
                    context.parent.currentOpenSubmenuContext.currentMenuHandler.setProps({open: false});
                    context.parent.currentOpenSubmenuContext = null;
                }
            }, 50);
        }
    },

    onClick(context, e) {
        // If not a submenu, open it (can be overridden for submenu, as menu is opened on mouseEnter)
        if (!context.parent) {
            const b = e.currentTarget.getBoundingClientRect();
            display(context, {anchorPosition: {left: b.left, top: b.top}, anchorReference: 'anchorPosition'});
        }
    },

    onContextMenu(context, e) {
        e.preventDefault();
        display(context, {anchorPosition: {left: e.clientX, top: e.clientY}, anchorReference: 'anchorPosition'});
    }
});

export {menuAction};
