## Usage

This action will display a menu with multiple items and sub-menus. 
The action needs the target and/or filter used to retrieve its list of items. It will rely on `<DisplayActions>` to find the items to display 
It will also need two components, for rendering the menu itself and its items.

## Context parameters

- menuTarget : Name of target that will be used to find the menu items
- menuRenderer : A react component, used to render the menu. The component will receive the following props :
  - isSubMenu: PropTypes.bool.isRequired : Is the menu to display a submenu of another menu
  - isOpen: PropTypes.bool.isRequired : Is the menu open
  - anchor: PropTypes.object.isRequired : Where to display the menu ( object of shape `{ left: number, top:number}`)
  - onExited: PropTypes.func.isRequired : Function to call when the menu has been completely closed,
  - onMouseEnter: PropTypes.func.isRequired : Function to call when the menu is hovered,
  - onMouseLeave: PropTypes.func.isRequired : Function to call when the menu is left,
  - onClose: PropTypes.func.isRequired : Function to call to close the menu
  - children: PropTypes.node.isRequired : Menu items


- menuItemRenderer : A react component, used to render the menu items. The component will receive the following props :
  - context: The action context
  - onClick: Function to call when the menu item is clicked
  - onMouseEnter: Function to call when the menu item is hovered
  - onMouseLeave: Function to call when the menu item is left


