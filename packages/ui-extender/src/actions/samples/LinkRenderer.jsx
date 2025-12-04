import React from 'react';

const LinkRenderer = ({context}) => <span style={{backgroundColor: 'yellow'}} onClick={ev => context.onClick(context, ev)}>{context.label}</span>;

export {LinkRenderer};
