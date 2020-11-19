import React from 'react';
import PropTypes from 'prop-types';

const LinkRenderer = ({onClick, label, ...props}) => (
    <span style={{backgroundColor: 'yellow'}} onClick={ev => onClick(props, ev)}>{label}</span>
);

LinkRenderer.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string
};

export {LinkRenderer};
