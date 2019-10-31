import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Snackbar} from '@material-ui/core';
import {Close} from '@material-ui/icons';
import {IconButton} from '@material-ui/core';
import * as _ from 'lodash';
let Context = React.createContext();

class NotificationProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notification: {
                message: '',
                open: false,
                predefinedOptions: [],
                options: {}
            }
        };

        this.predefined = {
            closeButton: {
                action: [
                    <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={() => this.notificationContext.closeNotification()}
                    >
                        <Close/>
                    </IconButton>
                ]
            },
            noAutomaticClose: {
                onClose: () => {}
            },
            closeAfter5s: {
                autoHideDuration: 5000
            }
        };

        this.notificationContext = {
            notify: (message, predefinedOptions, options) => {
                if (typeof predefinedOptions === 'object' && predefinedOptions.constructor !== Array) {
                    options = predefinedOptions;
                    predefinedOptions = [];
                }

                this.setState({
                    notification: {
                        message: message,
                        open: true,
                        predefinedOptions: predefinedOptions || [],
                        options: options || {}
                    }
                });
            },
            closeNotification: () => {
                this.setState({
                    notification: {
                        message: '',
                        open: false,
                        predefinedOptions: [],
                        options: {}
                    }
                });
            }
        };
    }

    render() {
        let options = this.state.notification.options || {};
        let predefinedOptions = this.state.notification.predefinedOptions || [];

        predefinedOptions.forEach(key => this.predefined[key] && _.merge(options, this.predefined[key]));

        return (
            <React.Fragment>
                <Context.Provider value={this.notificationContext}>
                    {this.props.children}
                </Context.Provider>
                <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}

                open={this.state.notification.open}
                ContentProps={{
                    'aria-describedby': 'message-id'
                }}
                message={<span id="message-id">{this.state.notification.message}</span>}
                onClose={this.notificationContext.closeNotification}
                {...options}
            />
            </React.Fragment>
        );
    }
}

NotificationProvider.defaultProps = {
    children: null
};

NotificationProvider.propTypes = {
    children: PropTypes.element

};

let NotificationConsumer = Context.Consumer;

function withNotifications() {
    return WrappedComponent => {
        return class extends React.Component {
            render() {
                return (
                    <NotificationConsumer>{
                        notificationContext => (
                            <WrappedComponent notificationContext={notificationContext} {...this.props}/>
                        )
}
                    </NotificationConsumer>
                );
            }
        };
    };
}

export {NotificationProvider, NotificationConsumer, withNotifications};
