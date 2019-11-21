import React, {useContext} from 'react';
import {storiesOf} from '@storybook/react';
import {DisplayActions} from '../core/DisplayActions';
import {registry} from '../../registry';
import {withKnobs} from '@storybook/addon-knobs';
import PropTypes from 'prop-types';
import {ComponentRendererContext, ComponentRendererProvider} from './ComponentRenderer';

const Modal = ({text, onClose}) => (
    <>
        <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            opacity: 0.1,
            backgroundColor: 'black'
        }}
             onClick={onClose}
        />
        <div style={{
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
            <div style={{flex: '0 1 auto'}}>{text}</div>
        </div>
    </>
);

Modal.propTypes = {
    text: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

const OpenModalComponent = ({context, render: Render}) => {
    const componentRenderer = useContext(ComponentRendererContext);
    return (
        <Render context={{
            ...context,
            onClick: context => componentRenderer.render('test',
                <Modal text={context.content}
                       onClose={() => componentRenderer.destroy('test')}
                />
            )
        }}/>
    );
};

OpenModalComponent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
};

const initRegistry = () => {
    registry.clear();

    const openModalAction = registry.add('action', 'base-component', {
        component: OpenModalComponent
    });

    registry.add('action', 'renderer1', openModalAction, {
        targets: ['target'],
        label: 'component 1',
        content: 'test 1'
    });
    registry.add('action', 'renderer2', openModalAction, {
        targets: ['target'],
        label: 'component 2',
        content: 'test 2'
    });
};

const ButtonRenderer = ({context}) => (
    <div>
        <button type="button" onClick={ev => context.onClick(context, ev)}>{context.label}</button>
    </div>
);

ButtonRenderer.propTypes = {
    context: PropTypes.object.isRequired
};

storiesOf('ComponentRenderer', module)
    .addDecorator(storyFn => {
        initRegistry();
        return <ComponentRendererProvider>{storyFn()}</ComponentRendererProvider>;
    })
    .addDecorator(withKnobs)
    .add('Dialog', () => (
        <DisplayActions target="target" context={{path: '/test'}} render={ButtonRenderer}/>
    ));
