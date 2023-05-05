import PropTypes from 'prop-types';
import React from 'react';

export function Modal({context, onExited}) {
    return (
        <>
            <div
className='backdrop'
style={{
                 position: 'absolute',
                 width: '100%',
                 height: '100%',
                 top: 0,
                 left: 0,
                 opacity: 0.1,
                 backgroundColor: 'black'
             }}
onClick={onExited}
        />
            <div
className='modal'
style={{
                 position: 'absolute',
                 width: '200px',
                 height: '40px',
                 top: 'calc( 50% - 20px )',
                 left: 'calc( 50% - 100px )',
                 border: '1px solid',
                 backgroundColor: 'white',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center'
             }}
            >
                <div style={{flex: '0 1 auto'}}>{context.content}</div>
            </div>
        </>
    );
}

Modal.propTypes = {
    context: PropTypes.object.isRequired,
    onExited: PropTypes.func.isRequired
};
