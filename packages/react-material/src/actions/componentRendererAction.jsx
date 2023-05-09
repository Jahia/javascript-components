import React from 'react';
import {ComponentRendererConsumer} from './ComponentRenderer';

const componentRendererAction = {

    init(context, props) {
        const {componentRenderer} = props;
        context.renderComponent = comp => {
            if (!context.componentId) {
                const id = 'actionComponent-' + context.id;
                const componentHandler = {
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
