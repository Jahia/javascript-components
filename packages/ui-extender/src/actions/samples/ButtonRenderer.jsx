import React from 'react';
import PropTypes from 'prop-types';

const ButtonRenderer = ({context}) => (
    (context.isVisible !== false) && (
        <button
            style={{
                color: '#444444',
                background: '#F3F3F3',
                padding: '5px 10px',
                borderRadius: '2px',
                fontWeight: 'bold',
                fontSize: '9pt',
                outline: 'none'
            }}
            disabled={context.enabled === false}
            type="button"
            onClick={ev => context.onClick(context, ev)}
        >{context.label}
        </button>
    )
);

ButtonRenderer.propTypes = {
    context: PropTypes.object.isRequired
};

export {ButtonRenderer};
