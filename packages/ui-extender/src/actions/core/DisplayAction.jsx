import React from 'react';
import PropTypes from 'prop-types';
import {registry} from '../../registry';
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

        if (enhancedContext.loading === null || enhancedContext.loading === true) {
            let Loading = this.props.loading;
            if (Loading) {
                return (
                    <Loading context={enhancedContext}/>
                );
            }

            return false;
        }

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
}

StateActionComponent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

class DisplayActionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.innerRef = React.createRef();
        this.state = {};
    }

    render() {
        let {context, render, loading} = this.props;

        let subscription = this.subscription;
        if (subscription) {
            subscription.unsubscribe();
        }

        let enhancedContext = {...context};
        if (enhancedContext.init) {
            const {context, ...props} = this.props;
            enhancedContext.init(enhancedContext, props);
        }

        // Check observers
        let observersObj = Object.keys(enhancedContext)
            .filter(key => enhancedContext[key] instanceof Observable)
            .reduce((acc, key) => {
                return {...acc, [key]: enhancedContext[key]};
            }, {});
        let keys = Object.keys(observersObj);

        if (keys.length > 0) {
            // Prepare an updateContext method for subscription - first set it as synchronous update of the context object
            let update = v => {
                if (this.innerRef.current) {
                    this.innerRef.current.setState(v);
                } else {
                    enhancedContext = Object.assign(enhancedContext, v);
                }
            };

            // Concat with a sync observer to always get an initial value
            let observers = Object.values(observersObj);

            keys.forEach(k => {
                enhancedContext[k] = null;
            });

            // Related to https://jira.jahia.org/browse/QA-11271
            // this empty subscription is auto cancelled with the first operator
            // and resolve a problem where the observer was never resolved is some cases
            observers.forEach(observer => observer.pipe(first()).subscribe());

            // Combine all observers into one
            let combinedObserver = combineLatest(...observers, (...vals) => keys.reduce((acc, key, i) => ({...acc, [key]: vals[i]}), {}));
            this.subscription = combinedObserver.subscribe(v => update(v));
            if (this.props.observerRef) {
                this.props.observerRef(combinedObserver);
            }
        } else if (this.props.observerRef) {
            this.props.observerRef(of(null));
        }

        return <StateActionComponent ref={this.innerRef} context={enhancedContext} render={render} loading={loading}/>;
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
    loading: PropTypes.func,
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

        let Component;
        if (action) {
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
    }

    shouldComponentUpdate(nextProps) {
        return !shallowEquals(nextProps.context, this.props.context);
    }

    wrap(Render, wrapper) {
        return props => wrapper(<Render key={this.id} {...props}/>);
    }

    render() {
        let {context, actionKey, render, loading, observerRef, ...otherProps} = this.props;
        let action = registry.get('action', actionKey);

        if (!action) {
            return null;
        }

        let Component = this.Component;

        let enhancedContext = {...action, ...context, originalContext: context, id: this.id, actionKey, displayActionProps: otherProps};
        return (
            <Component key={this.id}
                       context={enhancedContext}
                       render={render}
                       loading={loading}
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
     * The loading component
     */
    loading: PropTypes.func,

    /**
     * ..
     */
    observerRef: PropTypes.func
};

export {DisplayAction};
