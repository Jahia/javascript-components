import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {ComponentRendererContext} from '../../ComponentRenderer';
import {DisplayActions} from '../core/DisplayActions';

const Menu = ({context, menuContext, anchor, isOpen, onExited}) => {
    const {menuTarget, menuFilter, menuRenderer: MenuRenderer, menuItemRenderer: MenuItemRenderer, originalContext, parentMenuContext} = context;
    const {onClose, rootMenuContext} = menuContext;

    const Loading = ({context}) => {
        menuContext.loadingItems = menuContext.loadingItems || [];
        menuContext.loadingItems.push(context.key);
        return (
            <MenuItemRenderer context={context}/>
        );
    };

    const Render = ({context}) => {
        useEffect(() => {
            if (menuContext.setLoaded && menuContext.loadingItems && menuContext.loadingItems.length === 0) {
                menuContext.setLoaded();
            }
        });

        if (menuContext.loadingItems && menuContext.loadingItems.indexOf(context.key) !== -1) {
            menuContext.loadingItems = menuContext.loadingItems.filter(f => f !== context.key);
        }

        return (
            <MenuItemRenderer context={context}
                              onClick={event => {
                                  // Call the action and close the menu
                                  context.onClick(context, event);
                                  context.parentMenuContext.onCloseAll();
                              }}
                              onMouseEnter={event => {
                                  // Moved into a menu item, close current submenu if present
                                  if (context.parentMenuContext.subMenu) {
                                      context.parentMenuContext.closeSubMenu();
                                  }

                                  // Open submenu (only if current is still open and not being closed)
                                  if (context.parentMenuContext.open && context.menuContext) {
                                      const b = event.currentTarget.getBoundingClientRect();
                                      context.menuContext.display({left: b.left + b.width, top: b.top});
                                  }
                              }}
                              onMouseLeave={() => {
                                  // Check if the mouse moved out of the item, without going into the sub menu.
                                  setTimeout(() => {
                                      if (context.menuContext && !context.menuContext.inMenu) {
                                          context.menuContext.onClose();
                                      }
                                  }, 100);
                              }}
            />
        );
    };

    return (
        <MenuRenderer context={context}
                      isSubMenu={Boolean(parentMenuContext)}
                      anchor={anchor}
                      isOpen={isOpen}
                      onMouseEnter={() => {
                          menuContext.inMenu = true;
                      }}
                      onMouseLeave={() => {
                          menuContext.inMenu = false;
                      }}
                      onClose={onClose}
                      onExited={onExited}
        >
            <DisplayActions
                target={menuTarget}
                filter={menuFilter}
                context={{
                    ...originalContext,
                    originalContext,
                    parentMenuContext: context.menuContext,
                    rootMenuContext: rootMenuContext
                }}
                loading={Loading}
                render={Render}
            />
        </MenuRenderer>
    );
};

Menu.propTypes = {
    context: PropTypes.object.isRequired,
    menuContext: PropTypes.object.isRequired,
    anchor: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onExited: PropTypes.func.isRequired
};

const MenuActionComponent = ({context, render: Render, loading: Loading}) => {
    const componentRenderer = useContext(ComponentRendererContext);
    const id = 'actionComponent-' + context.id;

    context.menuContext = {};
    const {parentMenuContext, menuContext} = context;

    // Set loading flag if menu is going to preload, otherwise display the menu action directly
    const [isLoading, setLoading] = useState(Boolean(context.menuPreload));

    useEffect(() => {
        menuContext.rootMenuContext = context.rootMenuContext || menuContext;

        // Method to display the menu
        menuContext.display = anchor => {
            menuContext.open = true;

            // Create menu component
            componentRenderer.render(id, Menu, {
                context: context,
                menuContext: menuContext,
                anchor: anchor,
                isOpen: false,
                onExited: () => componentRenderer.destroy(id)
            });

            // If there's a parent, set the current context as submenu. Previous value should be null
            if (parentMenuContext) {
                parentMenuContext.subMenu = menuContext;
            }

            // Delay open to get animation
            setTimeout(() => {
                // All items have been loaded
                if (!menuContext.loadingItems || menuContext.loadingItems.length === 0) {
                    componentRenderer.setProperties(id, {isOpen: true});
                    setLoading(false);
                } else {
                    // Items require some time to be loaded, set loading state
                    setLoading(true);
                    menuContext.setLoaded = () => {
                        componentRenderer.setProperties(id, {isOpen: true});
                        delete menuContext.setLoaded;
                        setLoading(false);
                    };
                }
            }, 0);
        };

        // Method to close the current submenu
        menuContext.closeSubMenu = () => {
            if (menuContext.subMenu) {
                menuContext.subMenu.onClose();
                delete menuContext.subMenu;
            }
        };

        // Method to close the current menu and its submenu
        menuContext.onClose = () => {
            menuContext.open = false;
            menuContext.closeSubMenu();
            componentRenderer.setProperties(id, {isOpen: false});
        };

        // Method to close all menus
        menuContext.onCloseAll = () => {
            menuContext.rootMenuContext.onClose();
        };

        // Execute the preload if required - call the rendering without showing the menu
        if (context.menuPreload) {
            componentRenderer.render(id, Menu, {
                context: context,
                menuContext: menuContext,
                anchor: {top: 0, left: 0},
                isOpen: false,
                onExited: () => componentRenderer.destroy(id)
            });

            // Check if all items are loaded
            setTimeout(() => {
                if (!menuContext.loadingItems || menuContext.loadingItems.length === 0) {
                    // Everything is loaded, can destroy the preload component
                    componentRenderer.destroy(id);
                    setLoading(false);
                } else {
                    // Items require some time to be loaded, wait before resetting loading state
                    menuContext.setLoaded = () => {
                        componentRenderer.destroy(id);
                        setLoading(false);
                    };
                }
            }, 0);
        }
    });

    if (isLoading && Loading) {
        return <Loading context={context}/>;
    }

    return (
        <Render context={{
            ...context,
            onClick: (context, event) => {
                // Handle click to open menu only if not in a submenu (already handled on mouse over)
                if (!parentMenuContext) {
                    menuContext.display({left: event.clientX, top: event.clientY});
                }
            }
        }}/>
    );
};

MenuActionComponent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

/**
 * Context properties :
 *
 * menu : name of the target of actions to display in the menu
 * menuRenderer
 * menuItemRenderer
 */
const menuAction = {
    component: MenuActionComponent
};

export {menuAction, MenuActionComponent};
