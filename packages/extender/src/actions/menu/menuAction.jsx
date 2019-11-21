import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {ComponentRendererContext} from '../componentRenderer';
import {DisplayActions} from '../core/DisplayActions';

const Menu = ({context, anchor, isOpen, onExited}) => {
    const {menu, menuRenderer: MenuRenderer, menuItemRenderer: MenuItemRenderer, originalContext, parentMenuContext, onClose, onMouseEnter, onMouseLeave} = context;

    return (
        <MenuRenderer parentMenuContext={parentMenuContext}
                      anchor={anchor}
                      isOpen={isOpen}
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      onClose={onClose}
                      onExited={onExited}
        >
            <DisplayActions
                target={menu}
                context={{
                    originalContext,
                    parentMenuContext: context
                }}
                render={MenuItemRenderer}
            />
        </MenuRenderer>
    );
};

Menu.propTypes = {
    context: PropTypes.object.isRequired,
    anchor: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onExited: PropTypes.func.isRequired
};

const MenuActionComponent = ({context, render: Render}) => {
    const componentRenderer = useContext(ComponentRendererContext);
    const id = 'actionComponent-' + context.id;

    const closeSubMenu = context => {
        if (context.subMenu) {
            context.subMenu.onClose();
            delete context.subMenu;
        }
    };

    const display = anchor => {
        componentRenderer.render(id,
            <Menu context={context}
                  anchor={anchor}
                  isOpen={false}
                  onExited={() => componentRenderer.destroy(id)}
            />);

        const parentMenuContext = context.parentMenuContext;
        if (parentMenuContext) {
            if (parentMenuContext.subMenu !== context) {
                closeSubMenu(parentMenuContext);
                parentMenuContext.subMenu = context;
            }
        }

        setTimeout(() => componentRenderer.setProps(id, {isOpen: true}), 0);
    };

    context.onClose = () => {
        componentRenderer.setProps(id, {isOpen: false});
        closeSubMenu(context);
    };

    context.onMouseEnter = () => {
        context.inMenu = true;
    };

    context.onMouseLeave = () => {
        context.inMenu = false;
    };

    return (
        <Render context={{
            ...context,
            onClick: (context, event) => {
                if (!context.parentMenuContext) {
                    display({left: event.clientX, top: event.clientY});
                }
            },
            onMouseEnter: event => {
                const b = event.currentTarget.getBoundingClientRect();
                display({left: b.left + b.width, top: b.top});
            },
            onMouseLeave: () => {
                setTimeout(() => {
                    if (!context.inMenu) {
                        context.onClose();
                    }
                }, 100);
            }
        }}/>
    );
};

MenuActionComponent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
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
