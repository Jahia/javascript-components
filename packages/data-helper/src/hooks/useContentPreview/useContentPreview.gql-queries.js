import gql from 'graphql-tag';
import {PredefinedFragments} from '../../fragments/PredefinedFragments';

export const CONTENT_PREVIEW_QUERY = gql`query previewQueryByWorkspace($path: String!, $templateType: String!, $view: String!, $contextConfiguration: String!, $language: String!, $workspace: Workspace!, $requestAttributes: [InputRenderRequestAttributeInput]) {
    jcr(workspace: $workspace) {
        nodeByPath(path: $path) {
            id: uuid
            isFile: isNodeType(type: {types: ["jnt:file"]})
            path
            lastModified: property(name: "jcr:lastModified", language: $language) {
                value
            }
            renderedContent(templateType: $templateType, view: $view, contextConfiguration: $contextConfiguration, language: $language, requestAttributes: $requestAttributes) {
                output
                staticAssets(type: "css") {
                    key
                }
            }
            ...NodeCacheRequiredFields
        }
    }
}${PredefinedFragments.nodeCacheRequiredFields.gql}`;
