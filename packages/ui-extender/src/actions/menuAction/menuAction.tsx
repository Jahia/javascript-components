import React, {Reducer, useEffect, useMemo, useReducer, useRef} from 'react';
import ReactDOM from 'react-dom';
import {DisplayActions} from '../core/DisplayActions';

export declare type AnchorPosition = {
    top: number;
    left: number;
};
export declare type AnchorElOrigin = {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'center' | 'bottom';
};
export declare type TransformElOrigin = {
    horizontal: 'left' | 'right';
    vertical: 'top' | 'bottom';
};

type Anchor = {
    anchorEl?: unknown,
    anchorPosition?: AnchorPosition,
    anchorElOrigin?: AnchorElOrigin,
    transformElOrigin?: TransformElOrigin,
}

type MenuContext = {
    id: string,

    dispatch: (action: ActionType) => void

    display: (currentCtx: object | null, anchor: Anchor) => void
}

export type ItemLoadingProps = {
    id: string,

    // Legacy bag of props
    context?: object,

    parentMenuContext: MenuContext,

    menuItemRenderer: React.ComponentType<{ onClick?: (event: React.MouseEvent) => void }>
}

const ItemLoading = (props: ItemLoadingProps) => {
    const {id, parentMenuContext, menuItemRenderer: MenuItemRenderer} = {...props.context, ...props};

    useEffect(() => {
        parentMenuContext.dispatch({type: 'loading', item: id});
    });

    return (
        <MenuItemRenderer
            {...props}
            onClick={() => {
                //
            }}
        />
    );
};

type MenuItemRendererProps = {
    onClick?: (event: React.MouseEvent) => void,
    onMouseEnter?: (event: React.MouseEvent) => void,
    onMouseLeave?: (event: React.MouseEvent) => void
}

export type ItemRenderProps = {
    context?: object,
    id: string,
    menuItemRenderer: React.ComponentType<MenuItemRendererProps>,
    rootMenuContext: MenuContext,
    parentMenuContext: MenuContext,
    menuContext: MenuContext
    menuState?: MenuState,
    onClick?: (props: ItemRenderProps, event: React.MouseEvent) => void,
    isVisible?: boolean
};

const ItemRender = (props: ItemRenderProps) => {
    const {
        id,
        onClick,
        menuContext,
        menuState,
        rootMenuContext,
        parentMenuContext,
        menuItemRenderer: MenuItemRenderer,
        isVisible
    } = {...props.context, ...props};
    useEffect(() => {
        parentMenuContext.dispatch({type: 'loaded', item: id, isVisible: isVisible !== false});
    });

    // Values for menuContext / menuState are set only if this item is a submenu item.

    if (isVisible === false) {
        return null;
    }

    return (
        <MenuItemRenderer
            {...props}
            onClick={event => {
                // Call the action and close the menu
                if (onClick) {
                    onClick(props, event);
                    event.stopPropagation();
                    rootMenuContext.dispatch({type: 'close'});
                }
            }}
            onMouseEnter={event => {
                if (menuContext) {
                    // Open submenu (only if it's not opened already)
                    if (menuState && !menuState.isOpen) {
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

export type MenuProps = {
    id: string,
    actionKey: string,
    menuRenderer: React.ComponentType<MenuRendererProps>,
    menuItemRenderer: React.ComponentType<MenuItemRendererProps>,
    menuItemProps?: object,
    isMenuPreload?: boolean,
    menuTarget: string,
    menuFilter?: () => boolean,
    isMenuUseEventPosition?: boolean,
    buttonIcon?: React.ReactElement,
    originalContext?: object,
    rootMenuContext: MenuContext,
    parentMenuContext: MenuContext,
    menuContext: MenuContext,
    menuState: MenuState
}

export type MenuRendererProps = {
    id: string,
    context: object,
    menuKey: string,
    isOpen: boolean,
    isSubMenu: boolean,
    isLoading: boolean,
    anchor: Anchor,
    onMouseEnter?: (event: React.MouseEvent) => void,
    onMouseLeave?: (event: React.MouseEvent) => void
    onClose?: (event: Event) => void
    onExited?: (event: Event) => void
}

const Menu = (props: MenuProps) => {
    const {
        menuTarget,
        menuFilter,
        isMenuPreload,
        menuRenderer: MenuRenderer,
        menuItemRenderer,
        rootMenuContext,
        originalContext,
        id,
        actionKey,
        menuContext,
        menuState,
        menuItemProps
    } = props;
    return (
        <MenuRenderer
            id={id}
            context={{key: props.id, ...props}}
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
            onClose={e => {
                e.preventDefault();
                e.stopPropagation();
                menuContext.dispatch({type: 'close'});
            }}
            onExited={() => {
                if (!isMenuPreload) {
                    menuContext.dispatch({type: 'destroy'});
                }
            }}
        >
            <DisplayActions
                {...originalContext}
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

function add(items: string[], item: string) {
    return items.indexOf(item) === -1 ? [...items, item] : items;
}

function remove(items: string[], item: string) {
    return items.filter(f => f !== item);
}

type MenuState = {
    id: string,
    currentCtx: object & { originalContext?: object },
    anchor: Anchor,
    isRendered: boolean,
    isOpen: boolean,
    isInMenu: boolean,
    isSubMenu: boolean,
    subMenuContext?: MenuContext | null,
    loadingItems: string[],
    loadedItems: string[]
}

type ActionType =
    { type: 'render', currentCtx: object | null } | { type: 'destroy' } |
    { type: 'open', anchor: Anchor } | { type: 'close' } | { type: 'leaveItem' } |
    { type: 'enterMenu' } | { type: 'leaveMenu' } | { type: 'setSubMenuContext', value: MenuContext | null } |
    { type: 'loading', item: string } | { type: 'loaded', item: string, isVisible: boolean };

type ReducerType = (state: MenuState, action: ActionType) => MenuState;

const reducer: ReducerType = (state, action) => {
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
                    state.subMenuContext?.dispatch({type: 'close'});
                }, 0);
            }

            return {...state, subMenuContext: action.value};
        }

        case 'loading':
            return (state.loadingItems.includes(action.item) || state.loadedItems.includes(action.item)) ? state : {
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

export type MenuActionComponentProps = {
    /**
     * Action unique id
     */
    id: string,

    /**
     * Renderer used to render the menu
     */
    menuRenderer: React.ComponentType<MenuRendererProps>,

    actionKey: string,

    /**
     * Renderer used to render an item in the menu
     */
    menuItemRenderer: React.ComponentType,

    /**
     * Should the actions of the menu be preloaded
     */
    isMenuPreload?: boolean,

    /**
     * Target defining which actions to display in the menu
     */
    menuTarget: string,

    /**
     * Filter actions to display in the menu
     */
    menuFilter?: () => boolean,

    /**
     * Should the menu be displayed at the event position, or under the current element
     */
    isMenuUseEventPosition?: boolean,

    /**
     * Props passed to the main DisplayAction
     */
    originalContext?: object,

    /**
     * Root menu context, if sub menu (internal)
     */
    rootMenuContext: MenuContext,

    /**
     * Parent menu context, if sub menu (internal)
     */
    parentMenuContext: MenuContext,

    /**
     * Render for the action button
     */
    render: React.ComponentType<any>, /* eslint-disable @typescript-eslint/no-explicit-any */

    /**
     * Render for the action button
     */
    loading: React.ComponentType<any>,
    /**
     * Helps determine if action is visible
     */
    visibilityPredicate?: (state: MenuState) => boolean
}

const MenuActionComponent = (props: MenuActionComponentProps) => {
    const {
        rootMenuContext,
        parentMenuContext,
        isMenuPreload,
        render: Render,
        loading: Loading,
        visibilityPredicate
    } = props;
    const id = 'actionComponent-' + props.id;

    const elRef = useRef(document.getElementById('menuHolder'));
    if (!elRef.current) {
        elRef.current = document.createElement('div');
        elRef.current.setAttribute('id', 'menuHolder');
        document.body.appendChild(elRef.current);
    }

    const [menuState, dispatch] = useReducer<Reducer<MenuState, ActionType>>(reducer, {
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

    const menuContext: MenuContext = useMemo(() => ({
        id,
        dispatch,
        display(currentCtx: object | null, anchor: Anchor) {
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

    let isVisible = !isMenuPreload || menuState.loadedItems.length > 0;

    if (visibilityPredicate) {
        isVisible = visibilityPredicate(menuState);
    }

    return (
        <>
            {menuState.isOpen && menuState.loadingItems.length > 0 && Loading ? (
                <Loading {...props}/>
            ) : (
                <Render
                    {...props}
                    menuContext={menuContext}
                    menuState={menuState}
                    isVisible={isVisible}
                    onClick={(eventProps: MenuProps, event: React.MouseEvent) => {
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
                <Menu
                    {...props}
                    {...menuState.currentCtx.originalContext}
                    originalContext={{...props.originalContext, ...menuState.currentCtx.originalContext}}
                    menuContext={menuContext}
                    menuState={menuState}
                    rootMenuContext={rootMenuContext ? rootMenuContext : menuContext}
                />, elRef.current
            )}
        </>
    );
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
