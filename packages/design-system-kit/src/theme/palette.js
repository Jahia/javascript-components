import {colors} from '@material-ui/core';

// Moonstone Colors
const color = {
    light: '253, 253, 253',
    grayLight: '218, 218, 218',
    gray: '122, 127, 136',
    grayDark: '41, 49, 54',
    dark: '19, 28, 33',
    white: '255, 255, 255',
    black: '0, 0, 0',
    blue: '0, 160, 227',
    blueContrast: '0, 71, 129',
    blueDark: '0, 114, 177',
    blueLight: '99, 209, 255',
    green: '67, 160, 71',
    red: '224, 24, 45',
    redDark: '194, 23, 41',
    yellow: '232, 182, 6',
    purple: '112, 24, 224'
};

const rgba = (color, alpha = 1) => `rgba(${color}, ${alpha})`;

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
    // Modified with Moonstone colours
    brand: {
        alpha: rgba(color.blueDark),
        beta: rgba(color.blue),
        gamma: rgba(color.blue, 0.4)
    },
    ui: {
        alpha: rgba(color.light),
        beta: rgba(color.grayDark),
        gamma: '#303234',
        delta: rgba(color.gray),
        epsilon: '#FFFFFF',
        omega: rgba(color.grayLight, 0.4),
        zeta: rgba(color.gray, 0.4)
    },
    field: {
        alpha: rgba(color.light, 0.6)
    },
    invert: {
        alpha: rgba(color.dark),
        beta: '#FFFFFF'
    },
    font: {
        alpha: rgba(color.dark),
        beta: rgba(color.dark, 0.6),
        gamma: rgba(color.dark, 0.4)
    },
    hover: {
        alpha: '#086992',
        beta: '#F2F5F6',
        row: '#EFF2F3'
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
    },

    // Moonstone Palette
    moonstone: {
        accent: {
            main: rgba(color.blue),
            dark: rgba(color.blueDark),
            darkContrast: rgba(color.blueContrast),
            light: rgba(color.blueLight),
            light40: rgba(color.blueLight, 0.4)
        },
        neutral: {
            gray: rgba(color.gray),
            grayDark: rgba(color.grayDark),
            grayLight: rgba(color.grayLight),
            grayLight40: rgba(color.grayLight, 0.4)
        },
        support: {
            success: rgba(color.green),
            success40: rgba(color.green, 0.4),
            success60: rgba(color.green, 0.6),
            warning: rgba(color.yellow),
            warning40: rgba(color.yellow, 0.4),
            warning60: rgba(color.yellow, 0.6),
            danger: rgba(color.red),
            danger40: rgba(color.red, 0.4),
            danger60: rgba(color.red, 0.6),
            dangerDark: rgba(color.redDark)
        }
    }
};

export {dsGenericPalette};
