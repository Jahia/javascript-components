import PropTypes from 'prop-types';
import React from 'react';
import {Tooltip, withStyles} from '@material-ui/core';
import {compose} from 'recompose';
import classNames from 'classnames';

const styles = () => ({
    menuButton: {
        background: 'url(' + contextJsParameters.contextPath + '/engines/jahia-anthracite/images/logos/dx_logo_solid-white.png) center/100% no-repeat',
        width: '60px',
        height: '60px',
        backgroundSize: '100%'
    },
    menuButtonBlue: {
        background: 'url(' + contextJsParameters.contextPath + '/engines/jahia-anthracite/images/dx_logo_solid.png) center/100% no-repeat'
    }
});
/* eslint-disable react/jsx-no-bind */
export const BurgerMenuButton = ({classes, isDrawerOpen, title}) => {
    function openMenu() {
        const clickEvent = window.top.document.createEvent('MouseEvents');
        clickEvent.initEvent('click', true, true);
        window.top.document.getElementsByClassName('editmode-managers-menu')[0].dispatchEvent(clickEvent);
    }

    if (isDrawerOpen) {
        return (
            <div className={classNames(classes.menuButton, classes.menuButtonBlue)}
                 data-sel-role="burger-menu"
                 onClick={openMenu}/>
        );
    }

    return (
        <Tooltip title={title}
                 placement="right"
        >
            <div className={classNames(classes.menuButton)}
                 data-sel-role="burger-menu"
                 onClick={openMenu}/>
        </Tooltip>
    );
};

BurgerMenuButton.propTypes = {
    isDrawerOpen: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
};

BurgerMenuButton.defaultProps = {
    isDrawerOpen: false
};

export default compose(
    withStyles(styles, {name: 'DxBurgerMenuButton'})
)(BurgerMenuButton);
