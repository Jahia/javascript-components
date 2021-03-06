const dsPaper = theme => ({
    elevation0: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '1px'
    },
    elevation1: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 1px 2px rgba(54, 63, 69, 0.1), 0px 2px 2px rgba(54, 63, 69, 0.08)',
        borderRadius: '1px'
    },
    elevation4: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 2px 2px rgba(54, 63, 69, 0.2), 0px 0px 2px rgba(54, 63, 69, 0.17)',
        borderRadius: '1px'
    },
    elevation8: {
        background: theme.palette.background.paper,
        boxShadow: '0px 3px 2px rgba(54, 63, 69, 0.2), 0px 1px 8px rgba(54, 63, 69, 0.08)',
        borderRadius: '1px'
    },
    elevation16: {
        background: theme.palette.background.paper,
        boxShadow: '0px 4px 7px rgba(54, 63, 69, 0.18), 0px 1px 16px rgba(54, 63, 69, 0.08)',
        borderRadius: '1px'
    }
});

export {dsPaper};
