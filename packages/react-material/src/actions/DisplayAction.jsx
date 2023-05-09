import React from 'react';
import PropTypes from 'prop-types';
import {actionsRegistry} from './actionsRegistry';
import * as _ from 'lodash';
import {Observable, combineLatest, of} from 'rxjs';
import {first} from 'rxjs/operators';

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
                    <Render
key={action.key}
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

        let enhancedContext = {...context};
        if (enhancedContext.init) {
            enhancedContext.init(enhancedContext, _.omit(this.props, ['context']));
        }

        // Check observers
        const observersObj = _.pickBy(enhancedContext, value => value instanceof Observable);
        const keys = Object.keys(observersObj);

        if (keys.length > 0) {
            // Prepare an updateContext method for subscription - first set it as synchronous update of the context object
            const update = v => {
                if (this.innerRef.current) {
                    this.innerRef.current.setState(v);
                } else {
                    enhancedContext = _.assign(enhancedContext, v);
                }
            };

            // Concat with a sync observer to always get an initial value
            const observers = Object.values(observersObj);

            keys.forEach(k => _.set(enhancedContext, k, null));

            // Related to https://jira.jahia.org/browse/QA-11271
            // this empty subscription is auto cancelled with the first operator
            // and resolve a problem where the observer was never resolved is some cases
            _.each(observers, observer => observer.pipe(first()).subscribe());

            // Combine all observers into one
            const combinedObserver = combineLatest(...observers, (...vals) => _.zipObject(keys, vals));
            this.subscription = combinedObserver.subscribe(v => update(v));
            if (this.props.observerRef) {
                this.props.observerRef(combinedObserver);
            }
        } else if (this.props.observerRef) {
            this.props.observerRef(of(null));
        }

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
    observerRef: null
};

DisplayActionComponent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    observerRef: PropTypes.func
};

const shallowEquals = (obj1, obj2) =>
    Object.keys(obj1).length === Object.keys(obj2).length
    && Object.keys(obj1).every(key => obj1[key] === obj2[key]);

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
