const dsAppBar = theme => ({
    root: {
        boxShadow: theme.shadows[8]
    },
    colorDefault: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary
    },
    colorPrimary: {
        backgroundColor: theme.palette.ui.beta,
        color: theme.palette.invert.beta
    },
    colorSecondary: {
        backgroundColor: theme.palette.layout.main,
        color: theme.palette.text.contrastText
    }
});

export {dsAppBar};
