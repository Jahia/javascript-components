import React from 'react';
import {SvgIcon} from '@material-ui/core';

function toIconComponent(icon, props) {
    const camelCased = s => s.replace(/-([a-z])/g, g => g[1].toUpperCase());

    const toComp = function (node, idx) {
        if (node.nodeType === 1) {
            const props = {key: idx};
            Array.prototype.slice.call(node.attributes).forEach(attr => {
                props[camelCased(attr.name)] = attr.value;
            });
            const children = Array.prototype.slice.call(node.childNodes).map((child, idx) => toComp(child, idx));
            return React.createElement(node.tagName, props, children);
        }
    };

    if (typeof icon === 'string') {
        if (icon.startsWith('<svg')) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(icon, 'image/svg+xml');
            const viewBox = doc.documentElement.attributes.viewBox ? doc.documentElement.attributes.viewBox.value : null;
            const children = Array.prototype.slice.call(doc.documentElement.childNodes).map((child, idx) => toComp(child, idx));
            return <SvgIcon viewBox={viewBox} {...props}>{children}</SvgIcon>;
        }

        return <img src={icon}/>;
    }

    if (props && icon) {
        return React.cloneElement(icon, props);
    }

    return icon;
}

export {toIconComponent};
