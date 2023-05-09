// We use require and not import to not include the binary file to the generated *.umd.js

const dsTypography = theme => (
    {
        // Every texts are disabled if no color specified
        root: {
            color: theme.palette.text.disabled
        },
        h1: {
            color: theme.palette.text.disabled
        },
        h2: {
            color: theme.palette.text.disabled
        },
        h3: {
            color: theme.palette.text.disabled
        },
        h4: {
            color: theme.palette.text.disabled
        },
        h5: {
            color: theme.palette.text.disabled
        },
        h6: {
            color: theme.palette.font.alpha
        },
        body1: {
            color: theme.palette.text.disabled
        },
        subtitle1: {
            color: theme.palette.text.disabled
        },
        subtitle2: {
            color: theme.palette.text.disabled
        },
        overline: {
            color: theme.palette.text.disabled
        },
        body2: {
            color: theme.palette.text.disabled
        },
        paragraph: {
            color: theme.palette.text.secondary
        },
        colorPrimary: {
            color: theme.palette.primary.main
        },
        colorSecondary: {
            color: theme.palette.secondary.main
        },
        colorTextPrimary: {
            color: theme.palette.text.primary
        },
        colorTextSecondary: {
            color: theme.palette.text.secondary
        },
        colorError: {
            color: theme.palette.error.main
        }
    });

export {dsTypography};
