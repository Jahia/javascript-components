import React from 'react';
import PropTypes from 'prop-types';
import {compose, Mutation} from 'react-apollo';
import {componentRendererAction} from './componentRendererAction';
import {composeActions} from './composeActions';
import {ProgressOverlay} from '../layout/ProgressOverlay';
import {withNotifications} from '../notification/NotificationProvider';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {withTranslation} from 'react-i18next';

class GenericDialogMutationCmp extends React.Component {
    onCompleted() {
        let {notificationContext, dialogData: {confirmMessage}} = this.props;
        notificationContext.notify(confirmMessage);
        this.props.onClose();
    }

    onError(ex) {
        let {t, notificationContext} = this.props;
        console.log(ex);
        let mess = ex.message;
        if (ex.graphQLErrors && ex.graphQLErrors.length > 0) {
            let graphQLError = ex.graphQLErrors[0];
            if (graphQLError.errorType === 'GqlLocalSiteException') {
                mess = t('label.errors.' + graphQLError.extensions.type, graphQLError.extensions);
            }
        }

        notificationContext.notify(mess, ['closeButton', 'noAutomaticClose']);
    }

    render() {
        const {t, dialogData: {mutation, mutationParams, title, description, beforeMutation}, onClose, onExited, open} = this.props;
        return (
            <Mutation mutation={mutation} onCompleted={() => this.onCompleted()} onError={e => this.onError(e)}>
                {(mutationCall, {loading}) => (
                    <React.Fragment>
                        {loading && <ProgressOverlay/>}
                        <Dialog open={open}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                onClose={onClose}
                                onExited={onExited}
                        >
                            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                            <DialogContent>
                                <DialogContentText variant="subtitle1"
                                                   id="alert-dialog-description"
                                >{description}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    color="primary"
                                    data-lsm-role="cancel-button"
                                    onClick={onClose}
                                >{t('label.cancel')}
                                </Button>
                                <Button
                                    color="primary"
                                    data-lsm-role="confirm-button"
                                    onClick={() => {
                                        if (beforeMutation) {
                                            beforeMutation();
                                        }

                                        return mutationCall(mutationParams);
                                    }}
                                >{t('label.confirm')}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>
)}
            </Mutation>
        );
    }
}

GenericDialogMutationCmp.propTypes = {
    dialogData: PropTypes.object.isRequired,
    // eslint-disable-next-line react/boolean-prop-naming
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onExited: PropTypes.func.isRequired,
    notificationContext: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
};

export const GenericDialogMutation = compose(
    withNotifications(),
    withTranslation()
)(GenericDialogMutationCmp);

let genericDialogMutationAction = composeActions(componentRendererAction, {

    init(context) {
        context.openDialogMutation = dialogData => {
            let handler = context.renderComponent(<GenericDialogMutation
                                                        open
                                                        dialogData={dialogData}

                                                        onClose={() => {
                                                             handler.setProps({open: false});
                                                         }}
                                                        onExited={() => {
                                                             handler.destroy();
                                                             if (context.onExited) {
                                                                 context.onExited();
                                                             }
                                                         }}/>);
            if (context.onOpen) {
                context.onOpen();
            }
        };
    }

});

export {genericDialogMutationAction};
