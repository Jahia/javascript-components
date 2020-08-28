import React from 'react';
import PropTypes from 'prop-types';

const ButtonRenderer = ({onClick, isVisible, enabled, label, ...props}) => (
    (isVisible !== false) && (
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
            disabled={enabled === false}
            type="button"
            onClick={ev => onClick(props, ev)}
        >{label}
        </button>
    )
);

ButtonRenderer.propTypes = {
    onClick: PropTypes.func
};

export {ButtonRenderer};
