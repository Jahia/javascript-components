import React, {Component, createContext} from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

const ComponentRendererContext = createContext();

class ComponentRendererProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            components: {},
            componentsProps: {}
        };

        this.value = {
            render: (key, component, props) => this.setState(previous => {
                let newState = {
                    components: {...previous.components},
                    componentsProps: {...previous.componentsProps}
                };
                newState.components[key] = component;
                newState.componentsProps[key] = {...props};
                return newState;
            }),
            setProps: (key, props) => this.setState(previous => {
                let newState = {
                    componentsProps: {...previous.componentsProps}
                };
                newState.componentsProps[key] = {...previous.componentsProps[key], ...props};
                return newState;
            }),
            destroy: key => this.setState(previous => {
                let newState = {
                    components: {...previous.components},
                    componentsProps: {...previous.componentsProps}
                };
                delete newState.components[key];
                delete newState.componentsProps[key];
                return newState;
            })
        };
    }

    render() {
        let components = _.values(_.map(this.state.components, (component, key) => React.cloneElement(component, {key, ...this.state.componentsProps[key]})));
        return (
            <ComponentRendererContext.Provider value={this.value}>
                {components}
                {this.props.children}
            </ComponentRendererContext.Provider>
        );
    }
}

ComponentRendererProvider.defaultProps = {
    children: null
};

ComponentRendererProvider.propTypes = {
    children: PropTypes.element
};

class ComponentRendererConsumer extends Component {
    render() {
        return <ComponentRendererContext.Consumer {...this.props}/>;
    }
}

export {ComponentRendererContext, ComponentRendererProvider, ComponentRendererConsumer};
