const dsCard = () => ({
    root: {
        '@media (min-width:600px)': {
            paddingLeft: '0px',
            paddingRight: '0px'
        }
    }
});

const dsCardContent = () => ({
    root: {
        paddingTop: 16,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0
    }
});

const dsCardHeader = () => ({
    root: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0
    },
    action: {
        alignSelf: 'flex-end',
        marginTop: '0px'
    }
});

export {dsCard, dsCardHeader, dsCardContent};

