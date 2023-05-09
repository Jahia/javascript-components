import React from 'react';
import {withNotifications} from './NotificationProvider';
import PropTypes from 'prop-types';

class NotificationCmp extends React.Component {
    componentDidMount() {
        const {notificationContext, message, predefinedOptions, options} = this.props;
        if (message && notificationContext) {
            notificationContext.notify(message, predefinedOptions, options);
        }
    }

    render() {
        return false;
    }
}

NotificationCmp.defaultProps = {
    message: '',
    predefinedOptions: null,
    options: null,
    notificationContext: null
};

NotificationCmp.propTypes = {
    message: PropTypes.string,
    predefinedOptions: PropTypes.arrayOf(PropTypes.string),
    options: PropTypes.object,
    notificationContext: PropTypes.object
};

export const Notification = withNotifications()(NotificationCmp);
