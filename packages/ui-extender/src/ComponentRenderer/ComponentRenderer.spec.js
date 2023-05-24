import React, {useContext} from 'react';
import {mount} from 'enzyme';
import {ComponentRendererProvider} from './ComponentRendererProvider';
import PropTypes from 'prop-types';
import {ComponentRendererContext} from './ComponentRendererContext';

const RenderedComponent = ({label}) => <div className="component">{label}</div>;

RenderedComponent.propTypes = {
    label: PropTypes.string
};

const Render = () => {
    const renderer = useContext(ComponentRendererContext);

    return (
        <>
            <button
                type="button"
                className="open"
                onClick={() => renderer.render('test', RenderedComponent, {label: 'test'})}
            >
                Open
            </button>
            <button
                type="button"
                className="update"
                onClick={() => renderer.setProperties('test', {label: 'updated'})}
            >
                Update
            </button>
            <button
                type="button"
                className="destroy"
                onClick={() => renderer.destroy('test')}
            >
                Destroy
            </button>
        </>
    );
};

describe('ComponentRenderer', () => {
    it('should render the component', () => {
        const wrapper = mount(
            <ComponentRendererProvider>
                <Render/>
            </ComponentRendererProvider>
        );

        wrapper.find('.open').simulate('click');

        expect(wrapper.find(RenderedComponent).props()).toStrictEqual({label: 'test'});

        wrapper.find('.update').simulate('click');
        expect(wrapper.find(RenderedComponent).props()).toStrictEqual({label: 'updated'});

        wrapper.find('.destroy').simulate('click');
    });

    it('should update the properties', () => {
        const wrapper = mount(
            <ComponentRendererProvider>
                <Render/>
            </ComponentRendererProvider>
        );

        wrapper.find('.open').simulate('click');
        wrapper.find('.update').simulate('click');

        expect(wrapper.find(RenderedComponent).props()).toStrictEqual({label: 'updated'});
    });

    it('should delete the component', () => {
        const wrapper = mount(
            <ComponentRendererProvider>
                <Render/>
            </ComponentRendererProvider>
        );

        wrapper.find('.open').simulate('click');
        wrapper.find('.destroy').simulate('click');
    });
});
