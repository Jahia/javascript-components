import PropTypes from 'prop-types';
import React from 'react';
import {Badge, Button, Typography, withStyles} from '@material-ui/core';
import {compose} from 'recompose';
import {toIconComponent} from '@jahia/react-material';

const styles = theme => ({
    badgeRoot: {
        display: 'block'
    }, badgeBadge: {
        right: 0, top: '-8px'
    }, listItem: {
        margin: 0, height: '64px', display: 'block', width: '60px!important', paddingBottom: '10px!important'
    }, typographyIconLight: {
        color: theme.palette.text.contrastText,
        fontSize: '9px',
        textTransform: 'uppercase',
        transition: 'all 0.2s ease-in 0s'
    }, typographyIcon: {
        color: theme.palette.text.secondary,
        fontSize: '9px',
        textTransform: 'uppercase',
        transition: 'all 0.2s ease-in 0s'
    }, colorClosed: {
        fill: theme.palette.text.contrastText, '& [fill="backgroundColor"]': {
            fill: theme.palette.layout.dark
        }
    }, colorOpen: {
        fill: theme.palette.text.secondary, '& [fill="backgroundColor"]': {
            fill: theme.palette.background.paper
        }
    }
});

export const LeftMenuItem = ({classes, drawer, context}) => {
    const {onClick, buttonLabel, buttonIcon, badge} = context;

    const icon = toIconComponent(buttonIcon, drawer ? {classes: {root: classes.colorOpen}} : {classes: {root: classes.colorClosed}});

    const Content = (
        <React.Fragment>
            {Boolean(icon) && icon}
            <Typography
                className={drawer ? classes.typographyIcon : classes.typographyIconLight}
                data-sel-role='left-menu-item-text'
            >
                {buttonLabel}
            </Typography>
        </React.Fragment>
    );

    return (
        <Button className={classes.listItem} onClick={e => onClick(context, e)}>
            {badge ? (
                <Badge
                    badgeContent={badge}
                    color='error'
                    classes={{root: classes.badgeRoot, badge: classes.badgeBadge}}
                    data-sel-role='badge'
                >
                    {Content}
                </Badge>
            ) : Content}
        </Button>
    );
};

LeftMenuItem.propTypes = {
    context: PropTypes.object.isRequired, // eslint-disable-next-line react/boolean-prop-naming
    drawer: PropTypes.bool.isRequired, classes: PropTypes.object.isRequired
};

export default compose(withStyles(styles, {withTheme: true}))(LeftMenuItem);
