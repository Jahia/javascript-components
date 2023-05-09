// TODO BACKLOG-12393 - remove lodash
import * as _ from 'lodash';
import {parseType} from 'graphql';
import {PredefinedFragments} from '../fragments';

function findParametersInDocument(doc) {
    if (doc && doc.definitions) {
        return doc.definitions.flatMap(def => findParametersInSelectionSet(def.selectionSet));
    }

    return [];
}

const queryCache = {};

function replaceFragmentsInDocument(doc, fragments) {
    if (!fragments) {
        fragments = [];
    }

    const key = doc.definitions[0].name.value + '__' + fragments
        .map(f => (typeof f === 'string') ? PredefinedFragments[f] : f)
        .map(f => f.gql.definitions[0].name.value)
        .sort()
        .join('_');

    if (queryCache[key]) {
        return queryCache[key];
    }

    let clonedQuery = null;
    if (doc && doc.definitions) {
        clonedQuery = _.cloneDeep(doc);
        clonedQuery.definitions.forEach(def => replaceFragmentsInSelectionSet(def.selectionSet, fragments, def, clonedQuery));
        clonedQuery.definitions[0].name.value = key;
    }

    queryCache[key] = clonedQuery;

    return clonedQuery;
}

function findParametersInSelectionSet(selectionSet) {
    if (selectionSet && selectionSet.selections) {
        return selectionSet.selections.flatMap(sel =>
            sel.arguments.filter(arg => (arg.value.kind === 'Variable')).flatMap(arg => arg.value.name.value)
                .concat(findParametersInSelectionSet(sel.selectionSet))
                .filter(f => typeof f !== 'undefined')
        );
    }

    return [];
}

function findFragmentsInSelectionSet(selectionSet) {
    if (selectionSet && selectionSet.selections) {
        return selectionSet.selections.filter(sel => sel.kind === 'FragmentSpread').map(sel => sel.name.value)
            .concat(selectionSet.selections.flatMap(sel => findFragmentsInSelectionSet(sel.selectionSet)));
    }

    return [];
}

function replaceFragmentsInSelectionSet(selectionSet, fragments, def, document) {
    if (selectionSet && selectionSet.selections) {
        const newFragmentsSpreads = [];
        const removedFragmentSpreads = [];
        // Look for all existing fragment spreads in selection set
        selectionSet.selections.filter(sel => sel.kind === 'FragmentSpread').forEach(sel => {
            // Handle only named fragments
            if (sel.name.value) {
                // Check if spread exists in current doc - if not, we replace or remove it
                const existing = document.definitions.find(definition => definition.kind === 'FragmentDefinition' && definition.name.value === sel.name.value);

                if (!existing) {
                    // First remove the spread, as it has no match in document
                    removedFragmentSpreads.push(sel);

                    // Check if a replacement is provided for this pseudo-fragment, then insert spreads and definitions
                    if (fragments) {
                        fragments = fragments.map(frag => (typeof frag === 'string') ? PredefinedFragments[frag] : frag);

                        const applyableFragments = fragments.filter(frag => frag.applyFor === sel.name.value);

                        applyableFragments.flatMap(fragment => fragment.gql.definitions).forEach(frag => {
                            const newSpread = _.cloneDeep(sel);
                            newSpread.name.value = frag.name.value;
                            newFragmentsSpreads.push(newSpread);

                            // Add the new fragment definition in document if it has not already been added
                            const existing = document.definitions.find(definition => definition.kind === 'FragmentDefinition' && definition.name.value === frag.name.value);
                            if (!existing) {
                                document.definitions.push(frag);
                            }
                        });

                        // Adds the associated variables to the query
                        const allVariables = applyableFragments.reduce((result, n) => ({...result, ...n.variables}), {});
                        Object.entries(allVariables).forEach(([name, value]) => {
                            const existing = def.variableDefinitions.find(def => def.variable.name.value === name);
                            if (!existing) {
                                const type = parseType(value, {noLocation: true});
                                def.variableDefinitions.push({
                                    kind: 'VariableDefinition',
                                    variable: {
                                        kind: 'Variable',
                                        name: {
                                            kind: 'Name',
                                            value: name
                                        }
                                    },
                                    type
                                });
                            }
                        });
                    }
                }
            }
        });

        // Removed replaced spreads
        selectionSet.selections = selectionSet.selections.filter(sel => removedFragmentSpreads.indexOf(sel) === -1);

        // Add all new spreads
        selectionSet.selections.push(...newFragmentsSpreads);

        // Recursively call on sub-selections set
        selectionSet.selections.forEach(sel => replaceFragmentsInSelectionSet(sel.selectionSet, fragments, def, document));
    }
}

export {replaceFragmentsInDocument, findParametersInDocument, findFragmentsInSelectionSet};
