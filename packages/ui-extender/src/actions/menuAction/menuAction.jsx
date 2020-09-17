import React, {useEffect, useMemo, useReducer, useRef} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {DisplayActions} from '../core/DisplayActions';

const ItemLoading = props => {
    const {id, parentMenuContext, menuItemRenderer: MenuItemRenderer} = {...props.context, ...props};

    useEffect(() => {
        parentMenuContext.dispatch({type: 'loading', item: id});
    });

    return (
        <MenuItemRenderer {...props}
                          onClick={() => {
                          }}/>
    );
};

ItemLoading.propTypes = {
    context: PropTypes.object,
    id: PropTypes.string.isRequired,
    menuItemRenderer: PropTypes.func,
    parentMenuContext: PropTypes.object
};

const ItemRender = props => {
    const {id, onClick, menuContext, menuState, rootMenuContext, parentMenuContext, menuItemRenderer: MenuItemRenderer, isVisible} = {...props.context, ...props};
    useEffect(() => {
        parentMenuContext.dispatch({type: 'loaded', item: id, isVisible});
    });

    // Values for menuContext / menuState are set only if this item is a submenu item.

    if (isVisible === false) {
        return false;
    }

    return (
        <MenuItemRenderer {...props}
                          onClick={event => {
                              // Call the action and close the menu
                              onClick(props, event);
                              event.stopPropagation();
                              rootMenuContext.dispatch({type: 'close'});
                          }}
                          onMouseEnter={event => {
                              if (menuContext) {
                                  // Open submenu (only if it's not opened already)
                                  if (!menuState.isOpen) {
                                      const c = event.currentTarget.getBoundingClientRect();
                                      menuContext.display(null, {
                                          anchorEl: {
                                              getBoundingClientRect: () => c
                                          },
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
    context: PropTypes.object,
    id: PropTypes.string.isRequired,
    menuItemRenderer: PropTypes.func,
    rootMenuContext: PropTypes.object,
    parentMenuContext: PropTypes.object,
    menuContext: PropTypes.object,
    menuState: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    isVisible: PropTypes.bool
};

const Menu = props => {
    const {menuTarget, menuFilter, isMenuPreload, menuRenderer: MenuRenderer, menuItemRenderer, rootMenuContext, originalContext, id, actionKey, menuContext, menuState, menuItemProps} = props;

    return (
        <MenuRenderer id={id}
                      menuKey={actionKey}
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
                          if (!isMenuPreload) {
                              menuContext.dispatch({type: 'destroy'});
                          }
                      }}
        >
            <DisplayActions {...originalContext}
                            id={id}
                            target={menuTarget}
                            filter={menuFilter}
                            buttonProps={menuItemProps}
                            menuRenderer={MenuRenderer}
                            menuItemRenderer={menuItemRenderer}
                            parentMenuContext={menuContext}
                            rootMenuContext={rootMenuContext}
                            loading={ItemLoading}
                            render={ItemRender}
            />
        </MenuRenderer>
    );
};

Menu.propTypes = {
    id: PropTypes.string.isRequired,
    actionKey: PropTypes.string.isRequired,
    menuRenderer: PropTypes.func,
    menuItemRenderer: PropTypes.func,
    menuItemProps: PropTypes.object,
    isMenuPreload: PropTypes.bool,
    menuTarget: PropTypes.string.isRequired,
    menuFilter: PropTypes.func,
    isMenuUseEventPosition: PropTypes.bool,
    buttonIcon: PropTypes.object,
    originalContext: PropTypes.object,
    rootMenuContext: PropTypes.object,
    parentMenuContext: PropTypes.object,
    menuContext: PropTypes.object.isRequired,
    menuState: PropTypes.object.isRequired
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
            return (state.loadingItems.includes(action.item) && !state.loadedItems.includes(action.item)) ? state : {
                ...state,
                loadingItems: add(state.loadingItems, action.item),
                loadedItems: remove(state.loadedItems, action.item)
            };
        case 'loaded':
            return (!state.loadingItems.includes(action.item) && (action.isVisible !== false) === state.loadedItems.includes(action.item)) ? state : {
                ...state,
                loadingItems: remove(state.loadingItems, action.item),
                loadedItems: action.isVisible === false ? remove(state.loadedItems, action.item) : add(state.loadedItems, action.item)
            };
        default:
            return state;
    }
};

const MenuActionComponent = props => {
    const {rootMenuContext, parentMenuContext, isMenuPreload, render: Render, loading: Loading} = props;
    const id = 'actionComponent-' + props.id;

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
    }, [id, menuState, menuContext]);

    return (
        <>
            {menuState.isOpen && menuState.loadingItems.length > 0 && Loading ? (
                <Loading {...props}/>
            ) : (
                <Render {...props}
                        menuContext={menuContext}
                        menuState={menuState}
                        isVisible={!isMenuPreload || menuState.loadedItems.length > 0}
                        onClick={(eventProps, event) => {
                            // Handle click to open menu only if not in a submenu (already handled on mouse over)
                            if (!parentMenuContext) {
                                if (event.currentTarget && !eventProps.isMenuUseEventPosition) {
                                    // Copy position of target element as it may be removed after load
                                    const boundingClientRect = event.currentTarget.getBoundingClientRect();
                                    const targetMock = {
                                        ...event.currentTarget,
                                        getBoundingClientRect: () => boundingClientRect
                                    };
                                    menuContext.display(eventProps, {
                                        anchorEl: targetMock,
                                        anchorElOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left'
                                        }
                                    });
                                } else {
                                    menuContext.display(eventProps, {
                                        anchorPosition: {
                                            left: event.clientX,
                                            top: event.clientY
                                        }
                                    });
                                }
                            }
                        }}
                />
            )}
            {(menuState.isRendered || isMenuPreload) && ReactDOM.createPortal(
                <Menu {...props}
                      {...menuState.currentCtx}
                      menuContext={menuContext}
                      menuState={menuState}
                      rootMenuContext={rootMenuContext ? rootMenuContext : menuContext}
                />, elRef.current
            )}
        </>
    );
};

MenuActionComponent.propTypes = {
    /**
     * Action unique id
     */
    id: PropTypes.string.isRequired,

    /**
     * Renderer used to render the menu
     */
    menuRenderer: PropTypes.func,

    /**
     * Renderer used to render an item in the menu
     */
    menuItemRenderer: PropTypes.func,

    /**
     * Should the actions of the menu be preloaded
     */
    isMenuPreload: PropTypes.bool,

    /**
     * Target defining which actions to display in the menu
     */
    menuTarget: PropTypes.string.isRequired,

    /**
     * Filter actions to display in the menu
     */
    menuFilter: PropTypes.func,

    /**
     * Should the menu be displayed at the event position, or under the current element
     */
    isMenuUseEventPosition: PropTypes.bool,

    /**
     * Props passed to the main DisplayAction
     */
    originalContext: PropTypes.object,

    /**
     * Root menu context, if sub menu (internal)
     */
    rootMenuContext: PropTypes.object,

    /**
     * Parent menu context, if sub menu (internal)
     */
    parentMenuContext: PropTypes.object,

    /**
     * Render for the action button
     */
    render: PropTypes.func.isRequired,

    /**
     * Render for the action button
     */
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
