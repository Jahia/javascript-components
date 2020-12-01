import React from 'react';
import {ComponentRendererConsumer} from './ComponentRenderer';

let componentRendererAction = {

    init: (context, props) => {
        let {componentRenderer} = props;
        context.renderComponent = comp => {
            if (!context.componentId) {
                let id = 'actionComponent-' + context.id;
                let componentHandler = {
                    id,
                    setProps: props => componentRenderer.setProps(id, props),
                    destroy: () => componentRenderer.destroy(id)
                };
                componentRenderer.render(id, comp);
                return componentHandler;
            }
        };
    },

    wrappers: [
        component => <ComponentRendererConsumer>{componentRenderer => React.cloneElement(component, {componentRenderer})}</ComponentRendererConsumer>
    ]

};

export {componentRendererAction};
