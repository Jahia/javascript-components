// TODO BACKLOG-12393 - refactor Legacy Picker into hook without lodash
import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import {replaceFragmentsInDocument} from './Picker.utils';
import {PickerItemsFragment, PredefinedFragments} from '../fragments';

class Picker extends React.Component {
    constructor(props) {
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
        ${PredefinedFragments.nodeCacheRequiredFields.gql}`;
        this.query = replaceFragmentsInDocument(this.query, fragments);

        let state = {};

        this.eventsHandlers = {};

        if (openPaths === null) {
            // Uncontrolled mode
            state.isOpenControlled = false;
            state.openPaths = [];
            this.eventsHandlers.onOpenItem = (path, open) => {
                this.setState(prevState => ({
                    openPaths: open ?
                        [...prevState.openPaths, path] :
                        _.filter(prevState.openPaths, thispath => thispath !== path)
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
            state.selectedPaths = defaultSelectedPaths ? _.clone(defaultSelectedPaths) : [];
            // Open selected path if open is uncontrolled
            if (defaultSelectedPaths && !state.isOpenControlled) {
                state.openPaths = this.addPathToOpenPath(defaultSelectedPaths, rootPaths, state.openPaths);
            }

            this.eventsHandlers.onSelectItem = (path, selected, multiple) => {
                this.setState(prevState => {
                    let newSelectedPaths = selected ?
                        [...(multiple ? prevState.selectedPaths : []), path] :
                        _.filter(prevState.selectedPaths, thispath => thispath !== path);
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((prevState.isOpenControlled !== (nextProps.openPaths !== null)) || (prevState.isSelectControlled !== (nextProps.selectedPaths !== null))) {
            console.warn('Cannot change between controlled/uncontrolled modes');
        }

        let newState = {};

        if (prevState.isOpenControlled && !_.eq(nextProps.openPaths, prevState.openPaths)) {
            newState.openPaths = nextProps.openPaths;
        }

        if (prevState.isSelectControlled && !_.eq(nextProps.selectedPaths, prevState.selectedPaths)) {
            newState.selectedPaths = nextProps.selectedPaths;
        }

        if (newState.openPaths || newState.selectedPaths) {
            return newState;
        }

        return null;
    }

    getVariables(selectedPaths, openPaths) {
        let {rootPaths, openableTypes, selectableTypes, queryVariables} = this.props;

        let vars = {
            rootPaths: rootPaths,
            types: _.union(openableTypes, selectableTypes),
            selectable: selectableTypes,
            openable: openableTypes,
            openPaths: openPaths
        };

        if (queryVariables) {
            _.assign(vars, queryVariables);
        }

        return vars;
    }

    getPickerEntries(data, selectedPaths, openPaths) {
        let pickerEntries = [];
        let nodesById = {};
        let jcr = data.jcr;

        let addNode = function (node, depth, index) {
            let selected = false;
            if (node.selectable) {
                selected = _.indexOf(selectedPaths, node.path) !== -1;
            }

            let pickerNode = {
                name: node.name,
                path: node.path,
                open: node.openable && _.indexOf(openPaths, node.path) !== -1,
                selected: selected,
                openable: node.openable,
                selectable: node.selectable,
                depth: depth,
                prefix: _.repeat('&nbsp;', depth * 3),
                node: node,
                hidden: false,
                hasChildren: node.children.pageInfo.nodesCount > 0
            };
            pickerEntries.splice(index, 0, pickerNode);
            nodesById[node.uuid] = pickerNode;
            return pickerNode;
        };

        if (jcr) {
            if (jcr.rootNodes) {
                _.forEach(jcr.rootNodes, rootNode => {
                    let root = addNode(rootNode, 0, 0);
                    root.hidden = this.props.hideRoot;
                });
            }

            if (jcr.openNodes) {
                _.sortBy(jcr.openNodes, ['path']).forEach(node => {
                    let parent = nodesById[node.uuid];
                    if (parent) {
                        let parentIndex = _.indexOf(pickerEntries, parent);
                        _.forEachRight(node.children.nodes, child => {
                            addNode(child, parent.depth + 1, parentIndex + 1);
                        });
                    }
                });
            }
        }

        // Nodes loaded, fill selection list
        let selectedNodes = _.filter(pickerEntries, node => {
            return node.selected;
        }).map(node => {
            return node.node;
        });

        selectedPaths = _.map(selectedNodes, 'path');
        pickerEntries = _.filter(pickerEntries, pickerNode => {
            return !pickerNode.hidden;
        });

        return pickerEntries;
    }

    addPathToOpenPath(pathsToOpen, rootPaths, openPaths) {
        _.each(pathsToOpen, path => {
            let rootFound = false;
            if (!path.endsWith('/')) {
                path += '/';
            }

            _.tail(_.split(path, '/')).reduce((acc, it) => {
                if (!rootFound) {
                    _.forEach(rootPaths, rootPath => {
                        rootFound = rootFound || (_.startsWith(acc, rootPath) && rootPath);
                    });
                }

                if (rootFound && !_.includes(openPaths, acc)) {
                    openPaths.push(acc);
                    if (!_.includes(openPaths, rootFound)) {
                        openPaths.push(rootFound);
                    }
                }

                return acc + '/' + it;
            }, '');
        });
        return openPaths;
    }

    openPaths(paths) {
        if (!(paths instanceof Array)) {
            paths = [paths];
        }

        this.setState(prevState => {
            let openPaths = this.addPathToOpenPath(paths, this.props.rootPaths, prevState.openPaths);
            return {openPaths: openPaths};
        });
    }

    render() {
        let selectedPaths = this.state.selectedPaths ? this.state.selectedPaths : this.props.selectedPaths;
        let openPaths = this.state.openPaths ? this.state.openPaths : this.props.openPaths;
        let {setRefetch} = this.props;

        openPaths = _.clone(openPaths);

        let vars = this.getVariables(selectedPaths, openPaths);

        return (
            <Query query={this.query} variables={vars} fetchPolicy="cache-first">
                {({error, loading, data, refetch}) => {
                    if (setRefetch) {
                        setRefetch({
                            query: this.query,
                            queryParams: vars,
                            refetch: refetch
                        });
                    }

                    let renderProp = this.props.children;
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

                    let pickerEntries = this.getPickerEntries(data, selectedPaths, openPaths);
                    this.previousEntries = pickerEntries;

                    return renderProp({pickerEntries, loading, ...this.eventsHandlers});
                }}
            </Query>
        );
    }
}

Picker.defaultProps = {
    onLoading: null,
    defaultOpenPaths: null,
    openPaths: null,
    defaultSelectedPaths: null,
    selectedPaths: null,
    setRefetch: null,
    queryVariables: null,
    fragments: [PickerItemsFragment.mixinTypes, PickerItemsFragment.primaryNodeType, PickerItemsFragment.isPublished, PredefinedFragments.displayName],
    onSelectionChange: null,
    onOpenItem: null,
    onSelectItem: null,
    children: null,
    hideRoot: false
};

Picker.propTypes = {

    /**
     * List of root paths for the picker
     */
    rootPaths: PropTypes.arrayOf(PropTypes.string).isRequired,

    /**
     * List of folder paths that are open by default (uncontrolled mode)
     */
    defaultOpenPaths: PropTypes.arrayOf(PropTypes.string),

    /**
     * List of node types that can be "opened" (folders)
     */
    openableTypes: PropTypes.arrayOf(PropTypes.string).isRequired,

    /**
     * List of open folders in controlled mode
     */
    openPaths: PropTypes.arrayOf(PropTypes.string),

    /**
     * List of node types that can be "selected" (items)
     */
    selectableTypes: PropTypes.arrayOf(PropTypes.string).isRequired,

    /**
     * Preselected items path (uncontrolled mode)
     */
    defaultSelectedPaths: PropTypes.arrayOf(PropTypes.string),

    /**
     * List of selected path in controlled mode
     */
    selectedPaths: PropTypes.arrayOf(PropTypes.string),

    /**
     * Callback when the selection has changed
     */
    onSelectionChange: PropTypes.func,

    /**
     * Optional function which receives refetch function of the Query component when the component is strapped
     */
    setRefetch: PropTypes.func,

    /**
     * Optional set of fragments to add to the graphQL query. Can be a string that identify a predefinedFragment or a fragment definition
     */
    fragments: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            applyFor: PropTypes.string.isRequired,
            variables: PropTypes.object,
            gql: PropTypes.object.isRequired
        })
    ])),

    /**
     * Optional set of variable to pass to the graphQL query, in order to fulfill fragments needs
     */
    queryVariables: PropTypes.object,

    // eslint-disable-next-line react/boolean-prop-naming
    hideRoot: PropTypes.bool,
    children: PropTypes.func,
    onOpenItem: PropTypes.func,
    onSelectItem: PropTypes.func,
    onLoading: PropTypes.func
};

export {Picker};
