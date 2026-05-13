export {useAdminRouteTreeStructure} from './adminRoutes/useAdminRoutesTreeStructure';
export {ComponentRenderer} from './ComponentRenderer/ComponentRenderer';
export {
    type ContextType,
    ComponentRendererConsumer,
    ComponentRendererContext
} from './ComponentRenderer/ComponentRendererContext';
export {ComponentRendererProvider} from './ComponentRenderer/ComponentRendererProvider';
export {
    componentRendererAction,
    ComponentRendererActionComponent,
    type ComponentRendererActionComponentProps
} from './actions/componentRendererAction/componentRenderAction';
export {
    DisplayAction,
    type DisplayActionProps
} from './actions/core/DisplayAction';
export {
    DisplayActions,
    type DisplayActionsProps
} from './actions/core/DisplayActions';
export {
    MenuActionComponent,
    menuAction,
    type AnchorElOrigin,
    type AnchorPosition,
    type MenuActionComponentProps,
    type MenuProps,
    type MenuRendererProps,
    type TransformElOrigin
} from './actions/menuAction/menuAction';
export {
    ContextualMenu,
    type ContextualMenuProps
} from './actions/menuAction/ContextualMenu';
export {registry} from './registry/registry';
export {composeServices} from './registry/composeServices';
export {
    IframeRenderer,
    getIframeRenderer,
    type IframeRendererProps
} from './IframeRenderer/IframeRenderer';

/**
 * Adapted from https://github.com/Jahia/jahia/blob/29cd15298a82e8bf7a40f31c254a970e62536907/gwt/src/main/java/org/jahia/ajax/gwt/utils/GWTInitializer.java#L151-L243
 */
export interface JahiaGWTParameters {
    serviceEntryPoint: string;
    contextPath: '' | `/${string}`;
    dxVersion: string;
    servletPath: string;
    pathInfo?: string;
    queryString?: string;
    developmentMode: 'true' | 'false';
    areaAutoActivated: 'true' | 'false';
    /** Only available in dev mode */
    modulesSourcesDiskPath?: string;
    /** Will be set to `guest` when not logged in */
    currentUser: string;
    /** Will be set to `/users/guest` when not logged in */
    currentUserPath: string;
    lang: string;
    langdisplayname: string;
    uilang: string;
    uilangdisplayname: string;
    workspace: string;
    siteUuid?: string;
    siteKey?: string;
    baseUrl: string;
    editUrl: string;
    studioUrl?: string;
    studioVisualUrl?: string;
    useWebsockets?: 'true';
    ckeCfg?: string;
    studioMaxDisplayableFileSize: string;
    serverDisplayableTimeZone: string;
    /** @since Jahia 8.2.4 */
    gwtFileUploadEnabled: 'true' | 'false';
}

// Keep an interface so that it can be extended
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContextJsParameters extends JahiaGWTParameters {}

declare global {
    interface Window {
        jahiaGWTParameters: JahiaGWTParameters;
        contextJsParameters: ContextJsParameters;
    }
}
