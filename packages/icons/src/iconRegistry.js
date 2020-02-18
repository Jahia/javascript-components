import {File, Folder, SiteWeb} from '@jahia/moonstone/dist/icons';
import NavMenuTextIcon from './NavMenuTextIcon';
import ContentIcon from './ContentIcon';

const ICON_BY_NODE_TYPE = {
    'jnt:navMenuText': NavMenuTextIcon,
    'jnt:page': File,
    'jnt:virtualsite': SiteWeb,
    'jnt:folder': Folder,
    'jnt:contentFolder': Folder,
    'jnt:content': ContentIcon
};

function getIcon(nodeType) {
    return ICON_BY_NODE_TYPE[nodeType];
}

export {getIcon};
