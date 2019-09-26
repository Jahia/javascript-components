import {colors} from '@material-ui/core';

const dsGenericPalette = {
    // Legacy Palette
    type: 'light',
    contrastThreshold: 3,
    tonalOffset: 0.2,
    common: {
        black: '#1f262a',
        white: '#FFFFFF'
    },
    primary: {
        main: '#007cb0',
        dark: '#005F87',
        light: '#009bdc'
    },
    secondary: {
        main: '#e57834',
        dark: '#bd5715',
        light: '#f57c30'
    },
    layout: {
        main: '#4e5156',
        dark: '#3b3d40'
    },
    text: {
        primary: '#1f262a',
        secondary: '#393B3C',
        hint: '#006f9e',
        disabled: '#91A3ae',
        contrastText: '#ffffff'
    },
    border: {
        main: '#D8DEE3'
    },
    valid: {
        main: '#13bd76'
    },
    error: {
        main: '#BD1330',
        light: '#e32646'
    },
    warning: {
        main: '#f6d62f'
    },
    background: {
        paper: '#ffffff',
        default: '#eff2f4',
        dark: '#1F262A'
    },
    publicationStatus: {
        published: {
            main: '#00aa4f'
        },
        modified: {
            main: '#EF6C00'
        },
        notPublished: {
            main: colors.grey[900]
        },
        mandatoryLanguageUnpublishable: {
            main: '#F6D62F'
        },
        liveModified: {
            main: '#F6D62F'
        },
        liveOnly: {
            main: '#F6D62F'
        },
        conflict: {
            main: '#F6D62F'
        },
        mandatoryLanguageValid: {
            main: '#F6D62F'
        },
        deleted: {
            main: '#FB9926'
        },
        markedForDeletion: {
            main: '#CC0000'
        },
        unpublished: {
            main: '#CECECE'
        }
    },
    confirmColor: {
        main: '#00a0e3'
    },
    publish: {
        main: colors.deepOrange[500]
    },
    enabled: {
        main: colors.green[400]
    },
    delete: {
        main: colors.red[600]
    },
    cancelButton: {
        main: '#676767'
    },
    status: {
        add: '#8ce385',
        overwrite: '#e3a35b'
    },

    // Palette v0.2.0
    brand: {
        alpha: '#007CB0',
        beta: '#00A0E3',
        gamma: '#D3E9F3'
    },
    ui: {
        alpha: '#F6FAFC',
        beta: '#3B3D40',
        gamma: '#303234',
        delta: '#6D737E',
        epsilon: '#FFFFFF',
        omega: '#E0E6EA',
        zeta: '#C1C8D5'
    },
    field: {
        alpha: '#F9FBFC'
    },
    invert: {
        alpha: '#131C21',
        beta: '#FFFFFF'
    },
    font: {
        alpha: '#373C42',
        beta: '#525C65',
        gamma: '#828892'
    },
    hover: {
        alpha: '#086992',
        beta: '#F2F5F6',
        row: '#F2F5F6'
    },
    support: {
        alpha: '#E0182D',
        beta: '#0EA982',
        gamma: '#E8B606',
        delta: '#E26A00',
        epsilon: '#FFD3D8',
        iota: '#DBEFEA',
        zeta: '#FFF6D5',
        omega: '#FFE3C0'
    }
};

export {dsGenericPalette};
