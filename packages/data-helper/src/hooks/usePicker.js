// TODO BACKLOG-12393 - refactor Legacy Picker into hook without lodash
/* import {useState} from 'react';
import {useQuery} from 'react-apollo';
import {replaceFragmentsInDocument} from './usePicker.utils';
import {PICKER_QUERY} from './picker.query';

export const usePicker = ({
    fragments,
    rootPaths,
    onOpenItem,
    onSelectItem,
    openPaths,
    selectedPaths,
    defaultSelectedPaths,
    onSelectionChange,
    defaultOpenPaths
}) => {
    const hydratedQuery = replaceFragmentsInDocument(PICKER_QUERY, fragments);

    // Selection code section
    const [isSelectControlled, setIsSelectControlled] = useState(selectedPaths !== null);
    const [selectedPathsState, setSelectedPathsState] = useState(
        selectedPaths === null ?
            defaultSelectedPaths ? [...defaultSelectedPaths] : [] :
            []
    );

    const onSelectItemHandler = onSelectItem && selectedPaths === null ? (path, selected, multiple) => {
        setSelectedPathsState(prevSelectedPaths => {
            let newSelectedPaths = selected ?
                [...(multiple ? prevSelectedPaths : []), path] :
                prevSelectedPaths.filter(thispath => thispath !== path);
            onSelectionChange(newSelectedPaths);
            return newSelectedPaths;
        });
    } : onSelectItem;

    // Open path code section
    const [isOpenControlled, setIsOpenControlled] = useState(openPaths !== null);
    const [openPathsState, setOpenPaths] = useState(
        openPaths === null ?
            defaultOpenPaths ? addPathToOpenPath(defaultOpenPaths, rootPaths, state.openPaths) : [] :
            []
    );
    // Open selected path if open is uncontrolled
    if (selectedPaths === null && defaultSelectedPaths && !isOpenControlled) {
        openPathsState = addPathToOpenPath(defaultSelectedPaths, rootPaths, state.openPaths);
    }

    const onOpenItemHandler = onOpenItem ? onOpenItem : (path, open) => {
        setOpenPaths(prevOpenPaths => open ?
            [...prevOpenPaths, path] :
            prevOpenPaths.filter(thispath => thispath !== path)
        );
    };
}; */
