import React, {useContext, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {IconButton, Snackbar} from '@material-ui/core';
import {Close} from '@material-ui/icons';
import * as _ from 'lodash';

const Context = React.createContext();

export const NotificationProvider = ({children}) => {
    const [notificationState, setNotificationState] = useState({
        message: '',
        open: false,
        predefinedOptions: [],
        options: {}
    });

    const notificationContext = useMemo(() => ({
        notify(message, predefinedOptions, options) {
            if (typeof predefinedOptions === 'object' && predefinedOptions.constructor !== Array) {
                options = predefinedOptions;
                predefinedOptions = [];
            }

            setNotificationState({
                message,
                open: true,
                predefinedOptions: predefinedOptions || [],
                options: options || {}
            });
        },
        closeNotification() {
            setNotificationState({
                message: '',
                open: false,
                predefinedOptions: [],
                options: {}
            });
        }
    }), [setNotificationState]);

    const predefined = {
        closeButton: {
            action: [
                <IconButton
                    key='close'
                    aria-label='Close'
                    color='inherit'
                    onClick={() => notificationContext.closeNotification()}
                >
                    <Close/>
                </IconButton>
            ]
        },
        noAutomaticClose: {
            onClose() {
                // Skip close
            }
        },
        closeAfter5s: {
            autoHideDuration: 5000
        }
    };

    const options = notificationState.options || {};
    const predefinedOptions = notificationState.predefinedOptions || [];

    predefinedOptions.forEach(key => predefined[key] && _.merge(options, predefined[key]));

    return (
        <React.Fragment>
            <Context.Provider value={notificationContext}>
                {children}
            </Context.Provider>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={notificationState.open}
                ContentProps={{
                    'aria-describedby': 'message-id'
                }}
                message={<span id='message-id'>{notificationState.message}</span>}
                onClose={notificationContext.closeNotification}
                {...options}
            />
        </React.Fragment>
    );
};

NotificationProvider.defaultProps = {
    children: null
};

NotificationProvider.propTypes = {
    children: PropTypes.element
};

export const NotificationConsumer = Context.Consumer;

export const withNotifications = () => WrappedComponent => class extends React.Component {
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

export const useNotifications = () => useContext(Context);

