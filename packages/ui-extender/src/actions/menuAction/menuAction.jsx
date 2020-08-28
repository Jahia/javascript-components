import React, {useEffect, useMemo, useReducer, useRef} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {DisplayActions} from '../core/DisplayActions';

const ItemLoading = ({context}) => {
    const {parentMenuContext, menuItemRenderer: MenuItemRenderer} = context;

    useEffect(() => {
        parentMenuContext.dispatch({type: 'loading', item: context.key});
    });

    return (
        <MenuItemRenderer context={context}
                          onClick={() => {
                          }}/>
    );
};

ItemLoading.propTypes = {
    context: PropTypes.object.isRequired
};

const ItemRender = ({context, ...otherProps}) => {
    const {menuContext, menuState, rootMenuContext, parentMenuContext, menuItemRenderer: MenuItemRenderer, isVisible} = context;
    useEffect(() => {
        parentMenuContext.dispatch({type: 'loaded', item: context.key, isVisible});
    });

    // Values for menuContext / menuState are set only if this item is a submenu item.

    if (isVisible === false) {
        return false;
    }

    return (
        <MenuItemRenderer context={context}
                          {...otherProps}
                          onClick={event => {
                              // Call the action and close the menu
                              context.onClick(context, event);
                              event.stopPropagation();
                              rootMenuContext.dispatch({type: 'close'});
                          }}
                          onMouseEnter={event => {
                              if (menuContext) {
                                  // Open submenu (only if it's not opened already)
                                  if (!menuState.isOpen) {
                                      menuContext.display(null, {
                                          anchorEl: event.currentTarget,
                                          anchorElOrigin: {vertical: 'top', horizontal: 'right'}
                                      });
                                  }
                              } else {
                                  // Moved into another menu item (not sub menu), close current submenu if present
                                  parentMenuContext.dispatch({type: 'setSubMenuContext', value: null});
                              }
                          }}
                          onMouseLeave={() => {
                              // Check if the mouse moved out of the item, without going into the sub menu.
                              if (menuContext) {
                                  setTimeout(() => {
                                      menuContext.dispatch({type: 'leaveItem'});
                                  }, 100);
                              }
                          }}
        />
    );
};

ItemRender.propTypes = {
    context: PropTypes.object.isRequired
};

const Menu = ({context, menuContext, menuState, rootMenuContext, ...otherProps}) => {
    const {menuTarget, menuFilter, menuRenderer: MenuRenderer, menuItemRenderer, originalContext} = context;
    return (
        <MenuRenderer context={context}
                      isSubMenu={menuState.isSubMenu}
                      anchor={menuState.anchor}
                      isLoading={menuState.loadingItems.length > 0}
                      isOpen={menuState.isOpen}
                      onMouseEnter={() => {
                          menuContext.dispatch({type: 'enterMenu'});
                      }}
                      onMouseLeave={() => {
                          menuContext.dispatch({type: 'leaveMenu'});
                      }}
                      onClose={() => {
                          menuContext.dispatch({type: 'close'});
                      }}
                      onExited={() => {
                          if (!context.menuPreload) {
                              menuContext.dispatch({type: 'destroy'});
                          }
                      }}
        >
            <DisplayActions
                target={menuTarget}
                filter={menuFilter}
                context={{
                    ...originalContext,
                    originalContext,
                    buttonProps: {},
                    menuRenderer: MenuRenderer,
                    menuItemRenderer,
                    parentMenuContext: menuContext,
                    rootMenuContext: rootMenuContext,
                    showIcons: context.showIcons
                }}
                {...otherProps}
                loading={ItemLoading}
                render={ItemRender}
            />
        </MenuRenderer>
    );
};

Menu.propTypes = {
    context: PropTypes.object.isRequired,
    menuContext: PropTypes.object.isRequired,
    menuState: PropTypes.object.isRequired,
    rootMenuContext: PropTypes.object.isRequired
};

function add(items, item) {
    return items.indexOf(item) === -1 ? [...items, item] : items;
}

function remove(items, item) {
    return items.filter(f => f !== item);
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'render':
            return {
                ...state,
                currentCtx: action.currentCtx ? action.currentCtx : {},
                isRendered: true
            };
        case 'destroy':
            return {
                ...state,
                isRendered: false
            };
        case 'open':
            return {
                ...state,
                isOpen: true,
                anchor: action.anchor
            };
        case 'close':
            return {...state, isOpen: false};
        case 'leaveItem':
            return {...state, isOpen: state.isInMenu};
        case 'enterMenu':
            return {...state, isInMenu: true};
        case 'leaveMenu':
            return {...state, isInMenu: false};
        case 'setSubMenuContext': {
            if (state.subMenuContext === action.value) {
                return state;
            }

            if (state.subMenuContext && state.subMenuContext !== action.value) {
                setTimeout(() => {
                    state.subMenuContext.dispatch({type: 'close'});
                }, 0);
            }

            return {...state, subMenuContext: action.value};
        }

        case 'loading':
            return {
                ...state,
                loadingItems: add(state.loadingItems, action.item),
                loadedItems: remove(state.loadedItems, action.item)
            };
        case 'loaded':
            return {
                ...state,
                loadingItems: remove(state.loadingItems, action.item),
                loadedItems: action.isVisible !== false ? add(state.loadedItems, action.item) : remove(state.loadedItems, action.item)
            };
        default:
            return state;
    }
};

const MenuActionComponent = ({context, render: Render, loading: Loading}) => {
    const id = 'actionComponent-' + context.id;
    const {rootMenuContext, parentMenuContext} = context;

    const elRef = useRef(document.getElementById('menuHolder'));
    if (!elRef.current) {
        elRef.current = document.createElement('div');
        elRef.current.setAttribute('id', 'menuHolder');
        document.body.appendChild(elRef.current);
    }

    const [menuState, dispatch] = useReducer(reducer, {
        id,
        isRendered: false,
        isOpen: false,
        isSubMenu: Boolean(parentMenuContext),
        isInMenu: false,
        loadingItems: [],
        loadedItems: [],
        subMenuContext: null,
        currentCtx: {},
        anchor: {
            anchorPosition: {
                top: -1000,
                left: -1000
            }
        }
    });

    const menuContext = useMemo(() => ({
        id,
        dispatch,
        display: (currentCtx, anchor) => {
            dispatch({type: 'render', currentCtx});
            // If there's a parent, set the current context as submenu. Previous value should be null
            if (parentMenuContext) {
                parentMenuContext.dispatch({type: 'setSubMenuContext', value: menuContext});
            }

            // Delay open to get animation
            setTimeout(() => {
                dispatch({type: 'open', anchor});
            }, 0);
        }
    }), [id, parentMenuContext]);

    useEffect(() => {
        if (!menuState.isOpen && menuState.subMenuContext) {
            menuState.subMenuContext.dispatch({type: 'close'});
            dispatch({type: 'setSubMenuContext', value: null});
        }
    }, [id, context, menuState, menuContext]);

    return (
        <>
            {menuState.isOpen && menuState.loadingItems.length > 0 && Loading ? (
                <Loading context={context}/>
            ) : (
                <Render context={{
                    ...context,
                    menuContext,
                    menuState,
                    isVisible: !context.menuPreload || menuState.loadedItems.length > 0,
                    onClick: (currentCtx, event) => {
                        // Handle click to open menu only if not in a submenu (already handled on mouse over)
                        if (!parentMenuContext) {
                            if (event.currentTarget && !currentCtx.menuUseEventPosition) {
                                // Copy position of target element as it may be removed after load
                                const boundingClientRect = event.currentTarget.getBoundingClientRect();
                                const targetMock = {
                                    ...event.currentTarget,
                                    getBoundingClientRect: () => boundingClientRect
                                };
                                menuContext.display(currentCtx, {
                                    anchorEl: targetMock,
                                    anchorElOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left'
                                    }
                                });
                            } else {
                                menuContext.display(currentCtx, {
                                    anchorPosition: {
                                        left: event.clientX,
                                        top: event.clientY
                                    }
                                });
                            }
                        }
                    }
                }}/>)}
            {(menuState.isRendered || context.menuPreload) && ReactDOM.createPortal(
                <Menu
                    context={{...context, ...menuState.currentCtx}}
                    menuContext={menuContext}
                    menuState={menuState}
                    rootMenuContext={rootMenuContext ? rootMenuContext : menuContext}
                />, elRef.current
            )}
        </>
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
