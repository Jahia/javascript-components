import {commonPalette} from './palette';
import {commonTablePagination} from './overrides/table';
import {typography} from './typography';

const commonBaseThemeConfig = {
    palette: commonPalette,
    typography,
    overrides: {
        MuiTablePagination: commonTablePagination
    },
    zIndex: {
        mobileStepper: 1000,
        appBar: 1004,
        drawer: 1008,
        modal: 1012,
        snackbar: 1400,
        tooltip: 1500
    }
};

export {commonBaseThemeConfig};
