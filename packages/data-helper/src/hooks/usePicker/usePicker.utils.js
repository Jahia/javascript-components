import {PredefinedFragments} from '../fragments';
import {parseType} from 'graphql';

const replaceFragmentsInSelectionSet = (def, fragments, document) => {
    if (!def.selectionSet || !def.selectionSet.selections) {
        return null;
    }

    let newFragmentsSpreads = [];
    let removedFragmentSpreads = [];

    def.selectionSet.selections
        .filter(sel => sel.kind === 'FragmentSpread')
        .forEach(sel => {
            // Handle only named fragments
            if (!sel.name.value) {
                return;
            }

            // Check if spread exists in current doc - if not, we replace or remove it
            const existing = document.definitions.find(definition => definition.kind === 'FragmentDefinition' && definition.name.value === sel.name.value);
            if (!existing) {
                return;
            }

            // First remove the spread, as it has no match in document
            removedFragmentSpreads.push(sel);

            // Check if a replacement is provided for this pseudo-fragment, then insert spreads and definitions
            if (!fragments) {
                return;
            }

            const applyableFragments = fragments
                .map(frag => (typeof frag === 'string') ? PredefinedFragments[frag] : frag)
                .filter(frag => frag.applyFor === sel.name.value);

            applyableFragments
                .flatMap(fragment => fragment.gql.definitions)
                .forEach(frag => {
                    newFragmentsSpreads.push({
                        ...sel,
                        name: {
                            ...sel.name,
                            value: frag.name.value
                        }
                    });

                    // Add the new fragment definition in document if it has not already been added
                    let existing = document.definitions.find(definition => definition.kind === 'FragmentDefinition' && definition.name.value === frag.name.value);
                    if (!existing) {
                        document.definitions.push(frag);
                    }
                });

            // Look for all existing fragment spreads in selection set
            const allVariables = applyableFragments.reduce((result, n) => Object.assign({}, result, n.variables), {});

            Object.keys(allVariables)
                .forEach(value => {
                    let existing = def.variableDefinitions.find(def => def.variable.name.value === name);
                    if (existing) {
                        return;
                    }

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
                });
        });

    return {
        ...def,
        selectionSet: {
            ...def.selectionSet,
            selections: [
                ...def.selectionSet.selections.filter(sel => removedFragmentSpreads.indexOf(sel) === -1),
                ...newFragmentsSpreads// Add all new spreads
            ]
                // Recursively call on sub-selections set
                .map(
                    sel => replaceFragmentsInSelectionSet(sel, fragments, document)
                )
        }
    };
};

export const replaceFragmentsInDocument = (doc, fragments) => {
    return doc && doc.definitions ?
        {
            ...doc,
            definitions: doc.map(def => replaceFragmentsInSelectionSet(def, fragments, doc))
        } :
        null;
};
