// TODO BACKLOG-12393 - refactor Legacy Picker into hook without lodash
import * as _ from 'lodash';
import {parseType} from 'graphql';
import {PredefinedFragments} from '../fragments';

function findParametersInDocument(doc) {
    if (doc && doc.definitions) {
        return _.flatMap(doc.definitions, def => findParametersInSelectionSet(def.selectionSet));
    }

    return [];
}

function replaceFragmentsInDocument(doc, fragments) {
    let clonedQuery = null;
    if (doc && doc.definitions) {
        clonedQuery = _.cloneDeep(doc);
        _.each(clonedQuery.definitions, def => replaceFragmentsInSelectionSet(def.selectionSet, fragments, def, clonedQuery));
    }

    return clonedQuery;
}

function findParametersInSelectionSet(selectionSet) {
    if (selectionSet && selectionSet.selections) {
        return _.flatMap(selectionSet.selections, sel =>
            _.without(_.concat(
                _.flatMap(_.filter(sel.arguments, arg => (arg.value.kind === 'Variable')), arg => arg.value.name.value),
                findParametersInSelectionSet(sel.selectionSet)), undefined)
        );
    }

    return [];
}

function findFragmentsInSelectionSet(selectionSet) {
    if (selectionSet && selectionSet.selections) {
        return _.concat(
            _.map(_.filter(selectionSet.selections, sel => sel.kind === 'FragmentSpread'), sel => sel.name.value),
            _.flatMap(selectionSet.selections, sel => findFragmentsInSelectionSet(sel.selectionSet)));
    }

    return [];
}

function replaceFragmentsInSelectionSet(selectionSet, fragments, def, document) {
    if (selectionSet && selectionSet.selections) {
        let newFragmentsSpreads = [];
        let removedFragmentSpreads = [];
        // Look for all existing fragment spreads in selection set
        _.each(_.filter(selectionSet.selections, sel => sel.kind === 'FragmentSpread'), sel => {
            // Handle only named fragments
            if (sel.name.value) {
                // Check if spread exists in current doc - if not, we replace or remove it
                let existing = _.find(document.definitions, definition => definition.kind === 'FragmentDefinition' && definition.name.value === sel.name.value);

                if (!existing) {
                    // First remove the spread, as it has no match in document
                    removedFragmentSpreads.push(sel);

                    // Check if a replacement is provided for this pseudo-fragment, then insert spreads and definitions
                    if (fragments) {
                        fragments = _.map(fragments, frag => (typeof frag === 'string') ? PredefinedFragments[frag] : frag);

                        let applyableFragments = _.filter(fragments, frag => frag.applyFor === sel.name.value);

                        let allFragmentsDefinitions = _.flatMap(applyableFragments, fragment => fragment.gql.definitions);
                        _.each(allFragmentsDefinitions, frag => {
                            let newSpread = _.cloneDeep(sel);
                            newSpread.name.value = frag.name.value;
                            newFragmentsSpreads.push(newSpread);

                            // Add the new fragment definition in document if it has not already been added
                            let existing = _.find(document.definitions, definition => definition.kind === 'FragmentDefinition' && definition.name.value === frag.name.value);
                            if (!existing) {
                                document.definitions.push(frag);
                            }
                        });

                        // Adds the associated variables to the query
                        let allVariables = _.reduce(applyableFragments, (result, n) => _.assign(result, n.variables), {});
                        _.each(allVariables, (value, name) => {
                            let existing = _.find(def.variableDefinitions, def => def.variable.name.value === name);
                            if (!existing) {
                                let type = parseType(value, {noLocation: true});
                                def.variableDefinitions.push({
                                    kind: 'VariableDefinition',
                                    variable: {
                                        kind: 'Variable',
                                        name: {
                                            kind: 'Name',
                                            value: name
                                        }
                                    },
                                    type: type
                                });
                            }
                        });
                    }
                }
            }
        });

        // Removed replaced spreads
        selectionSet.selections = _.filter(selectionSet.selections, sel => removedFragmentSpreads.indexOf(sel) === -1);

        // Add all new spreads
        selectionSet.selections.push(...newFragmentsSpreads);

        // Recursively call on sub-selections set
        _.each(selectionSet.selections, sel => replaceFragmentsInSelectionSet(sel.selectionSet, fragments, def, document));
    }
}

export {replaceFragmentsInDocument, findParametersInDocument, findFragmentsInSelectionSet};
