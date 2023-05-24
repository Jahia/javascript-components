import {
    DefinitionNode,
    DocumentNode,
    FragmentSpreadNode,
    NameNode,
    parseType,
    SelectionNode,
    SelectionSetNode,
    VariableDefinitionNode
} from 'graphql';
import {Fragment, PredefinedFragments} from '../fragments';
import {ExecutableDefinitionNode, FragmentDefinitionNode, OperationDefinitionNode} from 'graphql/language/ast';
import rfdc from 'rfdc';

const clone = rfdc();

type Mutable<T> = {
    -readonly [P in keyof T]: T[P]
};

function findParametersInDocument(doc: DocumentNode): string[] {
    if (doc && doc.definitions) {
        return doc.definitions.flatMap(def => 'selectionSet' in def ? findParametersInSelectionSet(def.selectionSet) : []);
    }

    return [];
}

const queryCache: {[key:string]: DocumentNode} = {};

function replaceFragmentsInDocument(doc: DocumentNode, fragments: (string|Fragment)[]) {
    if (!fragments) {
        fragments = [];
    }

    const key = (doc.definitions[0] as ExecutableDefinitionNode).name.value + '__' + fragments
        .map(f => (typeof f === 'string') ? PredefinedFragments[f] : f)
        .map(f => (f.gql.definitions[0] as FragmentDefinitionNode).name.value)
        .sort()
        .join('_');

    if (queryCache[key]) {
        return queryCache[key];
    }

    let clonedQuery: DocumentNode = null;
    if (doc && doc.definitions) {
        clonedQuery = clone(doc);
        clonedQuery.definitions.forEach(def => 'selectionSet' in def && replaceFragmentsInSelectionSet(def.selectionSet, fragments, def, clonedQuery));
        const operationDefinition = clonedQuery.definitions[0] as OperationDefinitionNode;
        (operationDefinition.name as Mutable<NameNode>).value = key;
    }

    queryCache[key] = clonedQuery;

    return clonedQuery;
}

function findParametersInSelectionSet(selectionSet: SelectionSetNode): string[] {
    if (selectionSet && selectionSet.selections) {
        return selectionSet.selections.flatMap(sel => 'arguments' in sel &&
            sel.arguments.filter(arg => (arg.value.kind === 'Variable')).flatMap(arg => 'name' in arg.value ? arg.value.name.value : [])
                .concat(findParametersInSelectionSet(sel.selectionSet))
                .filter(f => typeof f !== 'undefined')
        );
    }

    return [];
}

function findFragmentsInSelectionSet(selectionSet: SelectionSetNode): string[] {
    if (selectionSet && selectionSet.selections) {
        return selectionSet.selections
            .filter<FragmentSpreadNode>((sel): sel is FragmentSpreadNode => sel.kind === 'FragmentSpread').map(sel => sel.name.value)
            .concat(selectionSet.selections.flatMap(sel => findFragmentsInSelectionSet('selectionSet' in sel && sel.selectionSet)));
    }

    return [];
}

function replaceFragmentsInSelectionSet(selectionSet: SelectionSetNode, fragments: (string|Fragment)[], def: ExecutableDefinitionNode, document: Mutable<DocumentNode>) {
    if (selectionSet && selectionSet.selections) {
        const newFragmentsSpreads: FragmentSpreadNode[] = [];
        const removedFragmentSpreads: FragmentSpreadNode[] = [];
        // Look for all existing fragment spreads in selection set
        selectionSet.selections.filter<FragmentSpreadNode>((sel): sel is FragmentSpreadNode => sel.kind === 'FragmentSpread').forEach(sel => {
            // Handle only named fragments
            if (sel.name.value) {
                // Check if spread exists in current doc - if not, we replace or remove it
                const existing = document.definitions.find(definition => definition.kind === 'FragmentDefinition' && definition.name.value === sel.name.value);

                if (!existing) {
                    // First remove the spread, as it has no match in document
                    removedFragmentSpreads.push(sel);

                    // Check if a replacement is provided for this pseudo-fragment, then insert spreads and definitions
                    if (fragments) {
                        const applyableFragments = fragments
                            .map(frag => (typeof frag === 'string') ? PredefinedFragments[frag] : frag)
                            .filter(frag => frag.applyFor === sel.name.value);

                        applyableFragments.flatMap((fragment:Fragment) => fragment.gql.definitions).forEach((frag: FragmentDefinitionNode) => {
                            const newSpread = clone(sel);
                            (newSpread.name as Mutable<NameNode>).value = (frag as FragmentDefinitionNode).name.value;
                            newFragmentsSpreads.push(newSpread);

                            // Add the new fragment definition in document if it has not already been added
                            if (!document.definitions.find(definition => definition.kind === 'FragmentDefinition' && definition.name.value === frag.name.value)) {
                                (document.definitions as Array<DefinitionNode>).push(frag);
                            }
                        });

                        // Adds the associated variables to the query
                        const allVariables = applyableFragments.reduce((result:{[key: string]:string}, n) => ({...result, ...n.variables}), {});
                        Object.entries(allVariables).forEach(([name, value]) => {
                            if (!def.variableDefinitions.find(variableDef => variableDef.variable.name.value === name)) {
                                const type = parseType(value, {noLocation: true});
                                (def.variableDefinitions as Array<VariableDefinitionNode>).push({
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
        selectionSet.selections = selectionSet.selections.filter(sel => sel.kind !== 'FragmentSpread' || removedFragmentSpreads.indexOf(sel) === -1);

        // Add all new spreads
        (selectionSet.selections as Array<SelectionNode>).push(...newFragmentsSpreads);

        // Recursively call on sub-selections set
        selectionSet.selections.forEach(sel => 'selectionSet' in sel && replaceFragmentsInSelectionSet(sel.selectionSet, fragments, def, document));
    }
}

export {replaceFragmentsInDocument, findParametersInDocument, findFragmentsInSelectionSet};
