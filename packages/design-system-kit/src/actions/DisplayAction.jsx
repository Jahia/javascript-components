import React from 'react';
import PropTypes from 'prop-types';
import {actionsRegistry} from './actionsRegistry';
import * as _ from 'lodash';

let count = 0;

class StateActionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const enhancedContext = {...this.props.context, ...this.state};

        if (enhancedContext.displayDisabled || (enhancedContext.enabled !== false && enhancedContext.enabled !== null)) {
            const Render = this.props.render;
            if (enhancedContext.actions) {
                return _.map(enhancedContext.actions, action => (
                    <Render key={action.key}
                            context={{
                    ...enhancedContext,
                    ...action
                }}/>
                ));
            }

            return <Render context={enhancedContext}/>;
        }

        return false;
    }
}

StateActionComponent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
};

class DisplayActionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.innerRef = React.createRef();
        this.state = {
        };
    }

    render() {
        const {context, render} = this.props;

        const {subscription} = this;
        if (subscription) {
            subscription.unsubscribe();
        }

        const enhancedContext = {...context};
        if (enhancedContext.init) {
            enhancedContext.init(enhancedContext, _.omit(this.props, ['context']));
        }

        console.warn('Action won\'t be updated anymore, please use @jahia/ui-extender actions components instead');

        return <StateActionComponent ref={this.innerRef} context={enhancedContext} render={render}/>;
    }

    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        const {context} = this.props;
        if (context.destroy) {
            context.destroy(context);
        }
    }
}

DisplayActionComponent.defaultProps = {
};

DisplayActionComponent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
};

const shallowEquals = (obj1, obj2) =>
    Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every(key => obj1[key] === obj2[key]);

class DisplayAction extends React.Component {
    constructor(props) {
        super(props);
        this.id = props.actionKey + '-' + (count++);

        const {actionKey} = this.props;
        const action = actionsRegistry.get(actionKey);

        let Component = DisplayActionComponent;

        if (action.wrappers) {
            Component = _.reduce(action.wrappers, this.wrap.bind(this), DisplayActionComponent);
        }

        this.Component = Component;
    }

    shouldComponentUpdate(nextProps) {
        return !shallowEquals(nextProps.context, this.props.context);
    }

    wrap(Render, wrapper) {
        return props => wrapper(<Render key={this.id} {...props}/>);
    }

    render() {
        const {context, actionKey, render, observerRef} = this.props;
        const action = actionsRegistry.get(actionKey);
        const enhancedContext = {...action, ...context, originalContext: context, id: this.id, actionKey};

        const {Component} = this;

        return <Component key={this.id} context={enhancedContext} render={render} actionKey={actionKey} observerRef={observerRef}/>;
    }
}

DisplayAction.defaultProps = {
    observerRef: null
};

DisplayAction.propTypes = {
    actionKey: PropTypes.string.isRequired,
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    observerRef: PropTypes.func
};

export {DisplayAction};
