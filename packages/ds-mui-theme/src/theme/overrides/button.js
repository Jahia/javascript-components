const dsButton = (theme) => ({
    "root": {
        "padding": ""+theme.spacing.unit *2 + "px "+theme.spacing.unit *2+"px",
        "textTransform": "none",
        "margin": "0 "+theme.spacing.unit * 2+"px"
    },
    "label" : {

    },
    "fab": {
        "boxShadow": "0px 5px 1px -4px rgba(38, 38, 38, 0.4)"
    },
    "text": {
        "padding": 0,
        "boxShadow": "none",
        "minHeight": "auto",
        "minWidth": "auto",
        "&:hover": {
            "backgroundColor": "transparent"
        }
    },
    "contained": {
        "color": theme.palette.text.contrastText,
        "backgroundColor": theme.palette.text.secondary,
        "boxShadow": theme.shadows[4],
        "borderRadius": "1px",
        "&:hover": {
            "backgroundColor": theme.palette.text.primary,
            "boxShadow": theme.shadows[8],
        }
    },
    "containedPrimary": {
        "color": theme.palette.text.contrastText,
        "backgroundColor": theme.palette.primary.main,
        "&:hover": {
            "backgroundColor": theme.palette.primary.dark,
        }
    },
    "containedSecondary": {
        "color": theme.palette.text.contrastText,
        "backgroundColor": theme.palette.secondary.main,
        "&:hover": {
            "backgroundColor": theme.palette.secondary.dark,
        }
    },
    "textPrimary": {
        color: theme.palette.text.contrastText,
        "&:hover": {
            "backgroundColor": "transparent"
        }
    },
    "textSecondary": {
        color: theme.palette.text.contrastText,
        "&:hover": {
            "backgroundColor": "transparent"
        }
    },
    "sizeSmall": {
        "padding": ""+theme.spacing.unit *1 + "px "+theme.spacing.unit *2+"px",
    },
    "sizeLarge": {
        "padding": ""+theme.spacing.unit *2 + "px "+theme.spacing.unit *3+"px",
    },
    "fullWidth": {
        "width": "100%"
    },

});

const dsIconButton =  (theme) => ({
    "root":{
        "boxShadow": "none"
    }
});

const dsButtonBase = (theme) => ({
    "root": {}
});


export {dsButton, dsIconButton, dsButtonBase}
