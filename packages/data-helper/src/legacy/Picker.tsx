import React from 'react';
import {Query} from '@apollo/react-components';
import gql from 'graphql-tag';
import {displayName, Fragment, nodeCacheRequiredFields, replaceFragmentsInDocument} from '../fragments';
import {PickerItemsFragment} from './Picker.gql-fragments';
import {DocumentNode} from 'graphql';
import {QueryResult, OperationVariables} from '@apollo/client';
import rfdc from 'rfdc';
import deepEquals from 'fast-deep-equal';

const clone = rfdc();

type PropType = {
    /**
     * Optional set of fragments to add to the graphQL query. Can be a string that identify a predefinedFragment or a fragment definition
     */
    fragments?: (string| Fragment)[],

    /**
     * List of root paths for the picker
     */
    rootPaths?: string[],

    onOpenItem?: (path:string, open:boolean) => void

    onSelectItem?: (path:string, selected: boolean, multiple:boolean) => void,

    /**
     * List of open folders in controlled mode
     */
    openPaths?: string[],

    /**
     * List of selected path in controlled mode
     */
    selectedPaths?: string[],

    /**
     * Preselected items path (uncontrolled mode)
     */
    defaultSelectedPaths?: string[],

    /**
     * Callback when the selection has changed
     */
    onSelectionChange?: (paths:string[]) => void,

    /**
     * List of folder paths that are open by default (uncontrolled mode)
     */
    defaultOpenPaths?: string[],

    /**
     * List of node types that can be "opened" (folders)
     */
    openableTypes?: string[],

    /**
     * List of node types that can be "selected" (items)
     */
    selectableTypes?: string[],

    onLoading: (l: boolean) => void,

    /**
     * Optional set of variable to pass to the graphQL query, in order to fulfill fragments needs
     */
    queryVariables?: {[key:string]: any},

    hideRoot?: boolean,

    /**
     * Optional function which receives refetch function of the Query component when the component is strapped
     */
    setRefetch: (p: any) => void,

    children: (p: any) => React.ReactElement
};

type StateType = {
    isOpenControlled?: boolean,
    isSelectControlled?: boolean,
    openPaths?: string[],
    selectedPaths?: string[]
};

export class Picker extends React.Component<PropType, StateType> {
    query: DocumentNode;
    eventsHandlers: {onOpenItem?: (path:string, open:boolean) => void, onSelectItem?: (path:string, selected: boolean, multiple:boolean) => void};
    previousEntries: any;

    constructor(props: PropType) {
        super(props);

        const {
            fragments,
            rootPaths,
            onOpenItem,
            onSelectItem,
            openPaths,
            selectedPaths,
            defaultSelectedPaths,
            onSelectionChange,
            defaultOpenPaths
        } = props;

        const resolvedFragments = fragments || [PickerItemsFragment.mixinTypes, PickerItemsFragment.primaryNodeType, PickerItemsFragment.isPublished, displayName];

        this.query = gql`
            query PickerQuery($rootPaths:[String!]!, $selectable:[String]!, $openable:[String]!, $openPaths:[String!]!, $types:[String]!) {
                jcr {
                    rootNodes:nodesByPath(paths: $rootPaths) {
                        name
                        children(typesFilter:{types:$types}, limit:1) {
                            pageInfo {
                                nodesCount
                            }
                        }
                        selectable : isNodeType(type: {types:$selectable})
                        openable : isNodeType(type: {types:$openable})
                        ... NodeCacheRequiredFields
                        ... node
                    },
                    openNodes:nodesByPath(paths: $openPaths) {
                        ... NodeCacheRequiredFields
                        children(typesFilter:{types:$types}) {
                            nodes {
                                name
                                children(typesFilter:{types:$types}, limit:1) {
                                    pageInfo {
                                        nodesCount
                                    }
                                }
                                selectable : isNodeType(type: {types:$selectable})
                                openable : isNodeType(type: {types:$openable})
                                ... NodeCacheRequiredFields
                                ... node
                            }
                        }
                    }
                }
            }
        ${nodeCacheRequiredFields.gql}`;
        this.query = replaceFragmentsInDocument(this.query, resolvedFragments);

        const state: StateType = {};

        this.eventsHandlers = {};

        if (openPaths === null) {
            // Uncontrolled mode
            state.isOpenControlled = false;
            state.openPaths = [];
            this.eventsHandlers.onOpenItem = (path, open) => {
                this.setState(prevState => ({
                    openPaths: open ?
                        [...prevState.openPaths, path] :
                        prevState.openPaths.filter(thispath => thispath !== path)
                }));
            };

            if (defaultOpenPaths) {
                state.openPaths = this.addPathToOpenPath(defaultOpenPaths, rootPaths, state.openPaths);
            }
        } else {
            state.isOpenControlled = true;
            if (onOpenItem) {
                this.eventsHandlers.onOpenItem = onOpenItem;
            }
        }

        if (selectedPaths === null) {
            // Uncontrolled mode
            state.isSelectControlled = false;
            state.selectedPaths = defaultSelectedPaths ? clone(defaultSelectedPaths) : [];
            // Open selected path if open is uncontrolled
            if (defaultSelectedPaths && !state.isOpenControlled) {
                state.openPaths = this.addPathToOpenPath(defaultSelectedPaths, rootPaths, state.openPaths);
            }

            this.eventsHandlers.onSelectItem = (path, selected, multiple) => {
                this.setState(prevState => {
                    const newSelectedPaths = selected ?
                        [...(multiple ? prevState.selectedPaths : []), path] :
                        prevState.selectedPaths.filter(thispath => thispath !== path);
                    onSelectionChange(newSelectedPaths);
                    return {
                        selectedPaths: newSelectedPaths
                    };
                });
            };
        } else if (onSelectItem) {
            state.isSelectControlled = true;
            if (onSelectItem) {
                this.eventsHandlers.onSelectItem = onSelectItem;
            }
        }

        this.state = state;

        // Binding
        this.openPaths = this.openPaths.bind(this);
    }

    static getDerivedStateFromProps(nextProps: PropType, prevState: StateType) {
        if ((prevState.isOpenControlled !== (nextProps.openPaths !== null)) || (prevState.isSelectControlled !== (nextProps.selectedPaths !== null))) {
            console.warn('Cannot change between controlled/uncontrolled modes');
        }

        const newState: StateType = {};

        if (prevState.isOpenControlled && !deepEquals(nextProps.openPaths, prevState.openPaths)) {
            newState.openPaths = nextProps.openPaths;
        }

        if (prevState.isSelectControlled && !deepEquals(nextProps.selectedPaths, prevState.selectedPaths)) {
            newState.selectedPaths = nextProps.selectedPaths;
        }

        if (newState.openPaths || newState.selectedPaths) {
            return newState;
        }

        return null;
    }

    getVariables(selectedPaths: string[], openPaths: string[]) {
        const {rootPaths, openableTypes, selectableTypes, queryVariables} = this.props;

        const vars = {
            rootPaths,
            types: [...new Set([...openableTypes, ...selectableTypes])],
            selectable: selectableTypes,
            openable: openableTypes,
            openPaths
        };

        if (queryVariables) {
            Object.assign(vars, queryVariables);
        }

        return vars;
    }

    getPickerEntries(data: any, selectedPaths: string[], openPaths: string[]) {
        let pickerEntries: any[] = [];
        const nodesById:any = {};
        const {jcr} = data;

        const addNode = function (node:any, depth:number, index:number) {
            let selected = false;
            if (node.selectable) {
                selected = selectedPaths.indexOf(node.path) !== -1;
            }

            const pickerNode = {
                name: node.name,
                path: node.path,
                open: node.openable && openPaths.indexOf(node.path) !== -1,
                selected,
                openable: node.openable,
                selectable: node.selectable,
                depth,
                prefix: '&nbsp;'.repeat(depth * 3),
                node,
                hidden: false,
                hasChildren: node.children.pageInfo.nodesCount > 0
            };
            pickerEntries.splice(index, 0, pickerNode);
            nodesById[node.uuid] = pickerNode;
            return pickerNode;
        };

        if (jcr) {
            if (jcr.rootNodes) {
                jcr.rootNodes.forEach((rootNode: any) => {
                    const root = addNode(rootNode, 0, 0);
                    root.hidden = this.props.hideRoot || false;
                });
            }

            if (jcr.openNodes) {
                jcr.openNodes.concat()
                    .sort((a: any, b: any) => (a.path > b.path) ? 1 : ((b.path > a.path) ? -1 : 0))
                    .forEach((node: any) => {
                        const parent = nodesById[node.uuid];
                        if (parent) {
                            const parentIndex = pickerEntries.indexOf(parent);
                            node.children.nodes.slice().reverse().forEach((child: any) => {
                                addNode(child, parent.depth + 1, parentIndex + 1);
                            });
                        }
                    });
            }
        }

        // Nodes loaded, fill selection list
        const selectedNodes = pickerEntries.filter(node => node.selected).map(node => node.node);

        selectedPaths = selectedNodes.map(s => s.path);
        pickerEntries = pickerEntries.filter(pickerNode => !pickerNode.hidden);

        return pickerEntries;
    }

    addPathToOpenPath(pathsToOpen: string[], rootPaths:string[], openPaths: string[]) {
        pathsToOpen.forEach(path => {
            let rootFound: false | string = false;
            if (!path.endsWith('/')) {
                path += '/';
            }

            const [...tail] = path.split('/');
            tail.reduce((acc, it) => {
                if (!rootFound) {
                    rootPaths.forEach(rootPath => {
                        rootFound = rootFound || (acc.startsWith(rootPath) && rootPath);
                    });
                }

                if (rootFound && !openPaths.includes(acc)) {
                    openPaths.push(acc);
                    if (!openPaths.includes(rootFound)) {
                        openPaths.push(rootFound);
                    }
                }

                return acc + '/' + it;
            }, '');
        });
        return openPaths;
    }

    openPaths(paths: string[]) {
        if (!(paths instanceof Array)) {
            paths = [paths];
        }

        this.setState(prevState => {
            const openPaths = this.addPathToOpenPath(paths, this.props.rootPaths, prevState.openPaths);
            return {openPaths};
        });
    }

    render() {
        const selectedPaths = this.state.selectedPaths ? this.state.selectedPaths : this.props.selectedPaths;
        let openPaths = this.state.openPaths ? this.state.openPaths : this.props.openPaths;
        const {setRefetch} = this.props;

        openPaths = clone(openPaths);

        const vars = this.getVariables(selectedPaths, openPaths);

        return (
            <Query query={this.query} variables={vars} fetchPolicy='cache-first'>
                {(result: QueryResult<any, OperationVariables>): React.JSX.Element => {
                    const {error, loading, data, refetch} = result;
                    if (setRefetch) {
                        setRefetch({
                            query: this.query,
                            queryParams: vars,
                            refetch
                        });
                    }

                    const renderProp = this.props.children;
                    if (this.props.onLoading) {
                        this.props.onLoading(loading);
                    }

                    if (loading) {
                        if (this.previousEntries) {
                            return renderProp({pickerEntries: this.previousEntries, loading, ...this.eventsHandlers});
                        }

                        return renderProp({pickerEntries: [], loading, ...this.eventsHandlers});
                    }

                    if (error) {
                        return renderProp({pickerEntries: [], error, loading, ...this.eventsHandlers});
                    }

                    const pickerEntries = this.getPickerEntries(data, selectedPaths, openPaths);
                    this.previousEntries = pickerEntries;

                    return renderProp({pickerEntries, loading, ...this.eventsHandlers});
                }}
            </Query>
        );
    }
}
