export const encodeName = name => 'encoded_' + btoa(name).replace(/=/g, '');
