import React from 'react';
import {SvgIcon} from '@material-ui/core';

function toIconComponent(icon, props) {
    let camelCased = s => s.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });

    let toComp = function (node, idx) {
        if (node.nodeType === 1) {
            let props = {key: idx};
            Array.prototype.slice.call(node.attributes).forEach(attr => {
                props[camelCased(attr.name)] = attr.value;
            });
            let children = Array.prototype.slice.call(node.childNodes).map((child, idx) => toComp(child, idx));
            return React.createElement(node.tagName, props, children);
        }
    };

    if (typeof icon === 'string') {
        if (icon.startsWith('<svg')) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(icon, 'image/svg+xml');
            let viewBox = doc.documentElement.attributes.viewBox ? doc.documentElement.attributes.viewBox.value : null;
            let children = Array.prototype.slice.call(doc.documentElement.childNodes).map((child, idx) => toComp(child, idx));
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
