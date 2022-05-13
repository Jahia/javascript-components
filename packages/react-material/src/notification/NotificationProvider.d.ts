import * as React from 'react';

export type NotificationContext = {
    notify: (message:string, predefinedOptions?:(string|object), options?:object) => void;
    closeNotification: () => void;
}

export interface NotificationProviderProps {
    notificationContext: NotificationContext;
}

export const NotificationProvider: React.FunctionComponent<{}>;

export const useNotifications: () => NotificationContext;

export const withNotifications: () => ((wrappedComponent: React.Component) => React.Component);
