import React from 'react';
import {withStyles} from '@material-ui/core';

let withStylesAction = styles => {
    let Component = withStyles(styles)(props => props.children(props.classes));

    return {
        init(context, props) {
            context.classes = props.classes;
        },

        wrappers: [
            component => <Component>{classes => React.cloneElement(component, {classes})}</Component>
        ]
    };
};

export {withStylesAction};
