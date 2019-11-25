import React from 'react';
import PropTypes from 'prop-types';
import {registry} from '../../registry';
import * as _ from 'lodash';
import {combineLatest, Observable, of} from 'rxjs';
import {first} from 'rxjs/operators';

let count = 0;

class StateActionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let enhancedContext = {...this.props.context, ...this.state};

        if (enhancedContext.displayDisabled || (enhancedContext.enabled !== false && enhancedContext.enabled !== null)) {
            let Render = this.props.render;
            if (enhancedContext.actions) {
                return enhancedContext.actions.map(action => (
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
        this.state = {};
    }

    render() {
        let {context, render} = this.props;

        let subscription = this.subscription;
        if (subscription) {
            subscription.unsubscribe();
        }

        let enhancedContext = {...context};
        if (enhancedContext.init) {
            enhancedContext.init(enhancedContext, _.omit(this.props, ['context']));
        }

        // Check observers
        let observersObj = _.pickBy(enhancedContext, value => value instanceof Observable);
        let keys = Object.keys(observersObj);

        if (keys.length > 0) {
            // Prepare an updateContext method for subscription - first set it as synchronous update of the context object
            let update = v => {
                if (this.innerRef.current) {
                    this.innerRef.current.setState(v);
                } else {
                    enhancedContext = _.assign(enhancedContext, v);
                }
            };

            // Concat with a sync observer to always get an initial value
            let observers = Object.values(observersObj);

            keys.forEach(k => _.set(enhancedContext, k, null));

            // Related to https://jira.jahia.org/browse/QA-11271
            // this empty subscription is auto cancelled with the first operator
            // and resolve a problem where the observer was never resolved is some cases
            observers.forEach(observer => observer.pipe(first()).subscribe());

            // Combine all observers into one
            let combinedObserver = combineLatest(...observers, (...vals) => _.zipObject(keys, vals));
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

        let {context} = this.props;
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
    Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every(key => obj1[key] === obj2[key]);

class DisplayAction extends React.Component {
    constructor(props) {
        super(props);
        this.id = props.actionKey + '-' + (count++);

        let {actionKey} = this.props;
        let action = registry.get('action', actionKey);

        if (!action) {
            throw new Error('Cannot find action ' + actionKey);
        }

        let Component;
        if (typeof action.component === 'function') {
            Component = action.component;
        } else {
            Component = DisplayActionComponent;

            if (action.wrappers) {
                Component = action.wrappers.reduce(this.wrap.bind(this), DisplayActionComponent);
            }
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
        let {context, actionKey, render, observerRef} = this.props;
        let action = registry.get('action', actionKey);
        let Component = this.Component;

        let enhancedContext = {...action, ...context, originalContext: context, id: this.id, actionKey};
        return (
            <Component key={this.id}
                       context={enhancedContext}
                       render={render}
                       actionKey={actionKey}
                       observerRef={observerRef}
            />
        );
    }
}

DisplayAction.defaultProps = {
    observerRef: null
};

DisplayAction.propTypes = {
    /**
     * The key of the action to display
     */
    actionKey: PropTypes.string.isRequired,

    /**
     * The action context
     */
    context: PropTypes.object.isRequired,

    /**
     * The render component
     */
    render: PropTypes.func.isRequired,

    /**
     * ..
     */
    observerRef: PropTypes.func
};

export {DisplayAction};
