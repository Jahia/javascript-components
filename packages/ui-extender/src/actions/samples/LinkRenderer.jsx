import React from 'react';
import PropTypes from 'prop-types';

const LinkRenderer = ({context}) => <span style={{backgroundColor: 'yellow'}} onClick={ev => context.onClick(context, ev)}>{context.label}</span>;

LinkRenderer.propTypes = {
    context: PropTypes.object.isRequired
};

export {LinkRenderer};
