import React from 'react';
import PropTypes from 'prop-types';

function LinkRenderer({context}) {
    return <span style={{backgroundColor: 'yellow'}} onClick={ev => context.onClick(context, ev)}>{context.label}</span>;
}

LinkRenderer.propTypes = {
    context: PropTypes.object.isRequired
};

export {LinkRenderer};
